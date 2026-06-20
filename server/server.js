import app from "./src/app.js";
import { config } from "./src/config/env.config.js";
import connectDB from "./src/config/db.config.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
