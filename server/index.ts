import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { todosRoute } from "./routes/todos.route";

const app = new Hono();

app.use(logger());
const router = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.basePath("/api")
	.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
	.route("/todos", todosRoute);

export type AppType = typeof router;

export default app;
