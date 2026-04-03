import dotenv from "dotenv";
const env = process.env.NODE_ENV || "dev";

dotenv.config();

dotenv.config({ path: `.env.${env}` });

export default {
  env,
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
};
