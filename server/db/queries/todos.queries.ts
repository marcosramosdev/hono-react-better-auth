import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { todos } from "../schema";

type CreateTodoInput = {
	title: string;
	description?: string;
	userId: string;
};

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

export const getTodoFromUserId = async (userId: string) => {
	try {
		return await db
			.select()
			.from(todos)
			.where(eq(todos.userId, userId))
			.orderBy(desc(todos.createdAt));
	} catch (error) {
		console.error(error);
	}
};

export const createTodo = async ({
	title,
	description,
	userId,
}: CreateTodoInput) => {
	try {
		const [createdTodo] = await db
			.insert(todos)
			.values({
				title,
				description,
				userId,
			})
			.returning();

		return createdTodo;
	} catch (error) {
		console.error(error);
	}
};
