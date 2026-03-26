import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env["TURSO_DATABASE_URL"];
const tursoToken = process.env["TURSO_AUTH_TOKEN"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  ...(tursoUrl && tursoToken
    ? {
        datasource: {
          url: "file:./dev.db", // placeholder — adapter handles the real connection
        },
        migrate: {
          adapter: async () => new PrismaLibSql({ url: tursoUrl, authToken: tursoToken }),
        },
      }
    : {
        datasource: {
          url: process.env["DATABASE_URL"] || "file:./dev.db",
        },
      }),
});
