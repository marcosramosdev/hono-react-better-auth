import { Hono } from "hono";
import { todosRoute } from "./routes/todos";

const app = new Hono();

const router = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.basePath("/api")
	.route("/todos", todosRoute);

export type AppType = typeof router;

export default app;
