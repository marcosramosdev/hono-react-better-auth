import { Hono } from "hono";
import { getTodos } from "./db/queries";

const app = new Hono();

const router = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.get("/api/todos", async (c) => {
		try {
			const todos = await getTodos();
			return c.json(todos, 200);
		} catch (error) {
			console.error(error);
			return c.json({ error: "error fetching todos" }, 500);
		}
	});

export type AppType = typeof router;

export default app;
