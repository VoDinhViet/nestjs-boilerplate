import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import { users } from './schemas';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function main() {
  await db
    .insert(users)
    .values({
      email: 'vietvodinh12547@gmail.com',
      password: '123456',
    })
    .execute();
}

main()
  .then(() => {
    console.log('insert database successfully');
  })
  .catch((err) => {
    console.error(err);
  });
