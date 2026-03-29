import { Hono } from "hono";
import { getTodos, getTodosAmount } from "../db/queries/todos.queries";

export const todosRoute = new Hono()
	.get("/", async (c) => {
		try {
			const res = await getTodos();
			return c.json(res);
		} catch (error) {
			console.error(error);
			return c.json(
				{
					error: "failed to fetch todos",
				},
				500,
			);
		}
	})
	.get("/:amount", async (c) => {
		try {
			const { amount } = c.req.param();
			const res = await getTodosAmount(Number(amount));
			return c.json(res);
		} catch (error) {
			console.error(error);
			return c.json(
				{
					error: "failed to fetch todos",
				},
				500,
			);
		}
	});
