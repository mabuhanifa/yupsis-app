import axios from "axios";
import "dotenv/config";

const ssActivewearApi = axios.create({
  baseURL: process.env.SSACTIVEWEAR_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SSACTIVEWEAR_API_KEY}`,
  },
});

export default ssActivewearApi;
