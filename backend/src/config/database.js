import { Sequelize } from "sequelize";
import { env } from "./env.js";
import logger from "./logger.js";

const sequelize = env.DATABASE_URL
  ? new Sequelize(env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
      },
      pool: { max: 20, idle: 30000, acquire: 5000 },
      logging: (sql) => {
        if (env.NODE_ENV === "development") {
          logger.debug({ query: sql }, "sequelize query");
        }
      },
    })
  : new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: "postgres",
      pool: { max: 20, idle: 30000, acquire: 5000 },
      logging: (sql) => {
        if (env.NODE_ENV === "development") {
          logger.debug({ query: sql }, "sequelize query");
        }
      },
    });

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    const dbName = sequelize.config.database;
    logger.info({ db: dbName }, "Connected to PostgreSQL via Sequelize");
  } catch (err) {
    logger.fatal(err, "Failed to connect to database");
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await sequelize.close();
  logger.info("Disconnected from database");
}

export default sequelize;
