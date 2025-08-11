import { eq } from "drizzle-orm";
import httpStatusCodes from "http-status-codes";
import shopify from "../config/shopify.config.js";
import { db } from "../db/index.js";
import { products, variants } from "../db/schema.js";
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
              variants(first: 10) {
                edges {
                  node {
                    id
                    sku
                    inventoryItem {
                      id
                    }
                  }
                }
              }
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

  const createdShopifyProduct = body.data.productCreate.product;

  if (body.data.productCreate.userErrors.length > 0) {
    const errors = body.data.productCreate.userErrors
      .map((e) => e.message)
      .join(", ");
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      `Shopify API Error: ${errors}`
    );
  }

  await db.transaction(async (tx) => {
    await tx
      .update(products)
      .set({ shopifyProductId: createdShopifyProduct.id })
      .where(eq(products.id, productId));

    for (const edge of createdShopifyProduct.variants.edges) {
      const v = edge.node;
      await tx
        .update(variants)
        .set({
          shopifyVariantId: v.id,
          shopifyInventoryItemId: v.inventoryItem.id,
        })
        .where(eq(variants.sku, v.sku));
    }
  });

  return createdShopifyProduct;
};

const updateInventory = async (inventoryItemId, quantity) => {
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
        mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
          inventorySetOnHandQuantities(input: $input) {
            inventoryAdjustmentGroup {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          reason: "correction",
          setQuantities: [
            {
              inventoryItemId,
              locationId: process.env.SHOPIFY_LOCATION_ID,
              quantity,
            },
          ],
        },
      },
    },
  });

  if (body.data.inventorySetOnHandQuantities.userErrors.length > 0) {
    const errors = body.data.inventorySetOnHandQuantities.userErrors
      .map((e) => e.message)
      .join(", ");
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      `Shopify Inventory Update Error: ${errors}`
    );
  }

  return body.data.inventorySetOnHandQuantities.inventoryAdjustmentGroup;
};

export const shopifyService = {
  deployProduct,
  updateInventory,
};
