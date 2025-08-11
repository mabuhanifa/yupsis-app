import httpStatusCodes from "http-status-codes";
import shopify from "../config/shopify.config.js";
import { ApiError } from "../utils/ApiError.js";
import { productService } from "./product.service.js";

const transformToShopifyProductInput = (product) => {
  return {
    title: product.title,
    descriptionHtml: product.description,
    vendor: product.vendor,
    variants: product.variants.map((variant) => ({
      price: variant.price,
      sku: variant.sku,
      grams: variant.grams,
      inventoryItem: {
        tracked: true,
      },
      inventoryQuantities: {
        availableQuantity: variant.inventory?.quantity || 0,
        locationId: process.env.SHOPIFY_LOCATION_ID,
      },
    })),
  };
};

const deployProduct = async (productId) => {
  const product = await productService.getProductById(productId);
  if (!product) {
    throw new ApiError(
      httpStatusCodes.NOT_FOUND,
      "Product not found in local database."
    );
  }

  const productInput = transformToShopifyProductInput(product);

  const client = new shopify.clients.Graphql({
    session: {
      shop: process.env.SHOPIFY_SHOP,
      accessToken: process.env.SHOPIFY_API_ACCESS_TOKEN,
      id: "",
      state: "",
      isOnline: false,
    },
  });

  const { body } = await client.query({
    data: {
      query: `
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: productInput,
      },
    },
  });

  if (body.data.productCreate.userErrors.length > 0) {
    const errors = body.data.productCreate.userErrors
      .map((e) => e.message)
      .join(", ");
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      `Shopify API Error: ${errors}`
    );
  }

  return body.data.productCreate.product;
};

export const shopifyService = {
  deployProduct,
};
