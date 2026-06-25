import "dotenv/config";
import pg from "pg";

async function createDatabase() {
  if (process.env.DATABASE_URL) {
    console.log("Using Neon — database is provisioned automatically. Run `npm run db:migrate` instead.");
    process.exit(0);
  }

  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres",
  });

  const dbName = process.env.DB_NAME;
  const { rows } = await pool.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );

  if (rows.length === 0) {
    await pool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Created database "${dbName}"`);
  } else {
    console.log(`Database "${dbName}" already exists`);
  }

  await pool.end();
}

createDatabase().catch((err) => {
  console.error("Failed to create database:", err.message);
  process.exit(1);
});
