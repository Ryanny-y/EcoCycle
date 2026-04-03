import cors, { CorsOptions } from "cors";

const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];

const allowedNoOrigin = process.env.NODE_ENV !== "production";

const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return allowedNoOrigin
        ? callback(null, true)
        : callback(new Error("No origin not allowed"));
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
export default cors(corsConfig);
