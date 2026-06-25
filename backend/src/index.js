import "dotenv/config";
import app from "./app.js";
import { env, logger, connectDatabase } from "./config/index.js";

async function main() {
  await connectDatabase();

  app.listen(env.PORT, env.HOST, () => {
    logger.info({ port: env.PORT, host: env.HOST, env: env.NODE_ENV }, "Server started");
  });
}

main().catch((err) => {
  logger.fatal(err, "Failed to start server");
  process.exit(1);
});
