export const CONFIG = {
  host: process.env.DB_CONFIG_HOST || "localhost",
  user: process.env.DB_CONFIG_USER || "root",
  port: Number(process.env.DB_CONFIG_PORT) || 3306,
  password: process.env.DB_CONFIG_PASSWORD || "",
  database: process.env.DB_CONFIG_DATABASE || "moviesdb",
};
