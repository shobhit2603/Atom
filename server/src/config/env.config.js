import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.MONGO_URI ||
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.NODE_ENV
) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 8080,
  mongoURI: process.env.MONGO_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1d",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "10d",
  nodeEnv: process.env.NODE_ENV || "development",
};
