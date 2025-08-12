import { db } from "../db/index.js";

const getCategories = async () => {
  console.log("Querying database for categories in service...");
  const allCategories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
  console.log("Database query returned:", allCategories);
  return allCategories;
};

export const categoryService = {
  getCategories,
};
