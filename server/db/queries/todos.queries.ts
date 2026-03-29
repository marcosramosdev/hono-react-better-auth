import { desc } from "drizzle-orm";
import { db } from "../db";
import { todos } from "../schema";

export const getTodos = async () => {
	try {
		return await db.select().from(todos).orderBy(desc(todos.createdAt));
	} catch (error) {
		console.error(error);
	}
};

export const getTodosAmount = async (amount: number) => {
	try {
		return await db
			.select()
			.from(todos)
			.orderBy(desc(todos.createdAt))
			.limit(amount);
	} catch (error) {
		console.error(error);
	}
};
