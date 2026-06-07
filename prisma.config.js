import "dotenv/config";

export default {
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public",
  },
};

