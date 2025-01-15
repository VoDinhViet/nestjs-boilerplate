import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });
export default defineConfig({
  schema: './src/database/schemas/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
