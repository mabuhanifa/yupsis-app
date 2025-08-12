import { and, asc, count, desc, eq, like, sql } from "drizzle-orm";
import httpStatusCodes from "http-status-codes";
import { db } from "../db/index.js";
import {
  categories,
  inventory,
  products,
  productsToCategories,
  variants,
} from "../db/schema.js";
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
    limit = 12,
    sortBy = "createdAt",
    order = "desc",
    search,
    category,
  } = queryParams;
  const offset = (page - 1) * limit;

  // Note: Sorting by price is complex and not implemented here.
  // It would require a subquery on the variants table.
  const orderBy =
    order === "asc" ? asc(products[sortBy]) : desc(products[sortBy]);

  const categorySubquery = category
    ? db
        .select({ id: productsToCategories.productId })
        .from(productsToCategories)
        .innerJoin(
          categories,
          eq(productsToCategories.categoryId, categories.id)
        )
        .where(eq(categories.name, category))
    : undefined;

  const whereConditions = and(
    search ? like(products.title, `%${search}%`) : undefined,
    category ? sql`${products.id} in (${categorySubquery})` : undefined
  );

  const [productList, totalResult] = await Promise.all([
    db.query.products.findMany({
      where: whereConditions,
      limit,
      offset,
      orderBy,
      with: {
        variants: {
          columns: {
            price: true,
          },
          limit: 1, // Fetch only one variant to get a price
        },
      },
    }),
    db.select({ value: count() }).from(products).where(whereConditions),
  ]);

  const total = totalResult[0].value;
  const totalPages = Math.ceil(total / limit);

  return {
    data: productList,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
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

const getVariantBySku = async (sku) => {
  const variant = await db.query.variants.findFirst({
    where: eq(variants.sku, sku),
  });
  return variant;
};

const updateVariantInventory = async (variantId, quantity) => {
  return db
    .update(inventory)
    .set({ quantity, updatedAt: new Date() })
    .where(eq(inventory.variantId, variantId));
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
  getVariantBySku,
  updateVariantInventory,
  updateProduct,
  deleteProduct,
};
