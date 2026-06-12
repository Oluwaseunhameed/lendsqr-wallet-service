import app from "./app";
import { env } from "./config/env";
import { checkDatabaseConnection } from "./shared/utils/database-health";

async function startServer() {
  try {
    await checkDatabaseConnection();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Database connection failed", error);

    process.exit(1);
  }
}

startServer();
