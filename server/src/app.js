import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/env.config.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static("public"));

// routes declaration
app.use("/api/v1/auth", authRouter);

export default app;
