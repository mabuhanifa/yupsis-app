import { count, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders, products, syncHistory } from "../db/schema.js";

const getDashboardStats = async () => {
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);

  return {
    totalProducts: productCount.value,
    totalOrders: orderCount.value,
  };
};

const getSyncHistory = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const offset = (page - 1) * limit;

  const history = await db.query.syncHistory.findMany({
    limit: parseInt(limit),
    offset,
    orderBy: [desc(syncHistory.createdAt)],
  });
  return history;
};

const getChannels = async () => {
  const channelList = await db.query.channels.findMany();
  return channelList.map((c) => ({ ...c, status: "connected" }));
};

const logSyncEvent = async (data) => {
  return db.insert(syncHistory).values(data);
};

export const adminService = {
  getDashboardStats,
  getSyncHistory,
  getChannels,
  logSyncEvent,
};
