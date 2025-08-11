import { asc, desc, eq } from "drizzle-orm";
import httpStatusCodes from "http-status-codes";
import { db } from "../db/index.js";
import { inventory, products, variants } from "../db/schema.js";
import { ApiError } from "../utils/ApiError.js";

const createProduct = async (productData) => {
  const { variants: variantsData, ...productDetails } = productData;

  return db.transaction(async (tx) => {
    const [newProduct] = await tx
      .insert(products)
      .values(productDetails)
      .returning();

    if (variantsData && variantsData.length > 0) {
      const newVariants = variantsData.map((variant) => ({
        ...variant,
        productId: newProduct.id,
      }));

      const insertedVariants = await tx
        .insert(variants)
        .values(newVariants)
        .returning();

      const inventoryData = insertedVariants.map((variant, index) => ({
        variantId: variant.id,
        quantity: variantsData[index].inventory?.quantity || 0,
        location: variantsData[index].inventory?.location,
      }));

      if (inventoryData.length > 0) {
        await tx.insert(inventory).values(inventoryData);
      }
    }

    return getProductById(newProduct.id, tx);
  });
};

const getProducts = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = queryParams;
  const offset = (page - 1) * limit;
  const orderBy =
    order === "asc" ? asc(products[sortBy]) : desc(products[sortBy]);

  const productList = await db.query.products.findMany({
    limit,
    offset,
    orderBy,
    with: {
      variants: {
        with: {
          inventory: true,
        },
      },
    },
  });
  return productList;
};

const getProductById = async (productId, tx = db) => {
  const product = await tx.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      variants: {
        with: {
          inventory: true,
        },
      },
    },
  });

  if (!product) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, "Product not found");
  }
  return product;
};

const updateProduct = async (productId, updateData) => {
  const [updatedProduct] = await db
    .update(products)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning();

  if (!updatedProduct) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, "Product not found");
  }
  return updatedProduct;
};

const deleteProduct = async (productId) => {
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, productId))
    .returning();

  if (!deletedProduct) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, "Product not found");
  }
  return { message: "Product deleted successfully" };
};

export const productService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
