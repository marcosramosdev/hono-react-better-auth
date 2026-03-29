import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "../db/db";
import * as schema from "../db/schema";

export const auth = betterAuth({
	plugins: [openAPI()],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},

	trustedOrigins: [process.env.CLIENT_URL!],
});
