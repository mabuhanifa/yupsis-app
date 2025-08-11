import { LATEST_API_VERSION, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import "dotenv/config";

const shopify = shopifyApi({
  apiVersion: LATEST_API_VERSION,
  apiSecretKey: process.env.SHOPIFY_API_ACCESS_TOKEN,
  isCustomStoreApp: true,
  adminApiAccessToken: process.env.SHOPIFY_API_ACCESS_TOKEN,
  hostName: process.env.SHOPIFY_SHOP.replace("https://", ""),
});

export default shopify;
