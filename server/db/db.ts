import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const pool = new Pool({
	// biome-ignore lint/style/noNonNullAssertion: <>
	connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });
