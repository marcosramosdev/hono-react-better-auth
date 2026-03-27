import { seed } from "drizzle-seed";
import { db, pool } from "../server/db/db";
import * as schema from "../server/db/schema";

async function main() {
	await seed(db, schema).refine((funcs) => ({
		user: {
			columns: {},
			count: 10,
			with: {
				todos: 10,
			},
		},
		todos: {
			columns: {
				title: funcs.valuesFromArray({
					values: ["Buy groceries", "read a book", "call mom"],
				}),
				description: funcs.valuesFromArray({
					values: ["at 5pm", "weekly", "carefully", undefined],
				}),
			},
		},
	}));
}

main()
	.then(() => {
		console.log("seeded the database successfully");
		return pool.end();
	})
	.catch((err) => {
		console.error(err);
		return pool.end();
	});
