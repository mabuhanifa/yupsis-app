import { count, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders, products, syncHistory, users } from "../db/schema.js";

const getDashboardStats = async () => {
  const [totalProductsResult, totalOrdersResult, totalUsersResult] =
    await Promise.all([
      db.select({ value: count() }).from(products),
      db.select({ value: count() }).from(orders),
      db.select({ value: count() }).from(users),
    ]);

  return {
    totalProducts: totalProductsResult[0].value,
    totalOrders: totalOrdersResult[0].value,
    totalUsers: totalUsersResult[0].value,
  };
};

const getChannels = async () => {
  return db.query.channels.findMany();
};

const getSyncHistory = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const offset = (page - 1) * limit;

  const [history, totalResult] = await Promise.all([
    db.query.syncHistory.findMany({
      limit,
      offset,
      orderBy: [desc(syncHistory.createdAt)],
    }),
    db.select({ value: count() }).from(syncHistory),
  ]);

  const total = totalResult[0].value;
  const totalPages = Math.ceil(total / limit);

  return {
    data: history,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

export const adminService = {
  getDashboardStats,
  getChannels,
  getSyncHistory,
};
