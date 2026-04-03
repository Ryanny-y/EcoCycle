import dotenv from "dotenv";
const env = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${env}` });

export default {
  env,
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
};
