import { db } from "../db/index.js";

const getCategories = async () => {
  const allCategories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
  return allCategories;
};

export const categoryService = {
  getCategories,
};
