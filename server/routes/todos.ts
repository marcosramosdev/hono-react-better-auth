import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import {
	createTodo,
	getTodoFromUserId,
	getTodos,
} from "../db/queries/todos.queries";
import { authMiddleware } from "../middleware/authMiddleware";

type Env = {
	Variables: {
		user: {
			user: {
				id: string;
			};
		};
	};
};

export const todosRoute = new Hono<Env>()
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
	.post(
		"/",
		authMiddleware,
		zValidator(
			"json",
			z.object({
				title: z.string(),
				description: z.string().optional(),
			}),
		),
		async (c) => {
			try {
				const { title, description } = c.req.valid("json");
				const session = c.get("user");
				const createdTodo = await createTodo({
					title,
					description,
					userId: session.user.id,
				});

				if (!createdTodo) {
					return c.json(
						{
							error: "failed to create todo",
						},
						500,
					);
				}

				return c.json(createdTodo, 201);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						error: "failed to create todo",
					},
					500,
				);
			}
		},
	)
	.get("/user/:userId", authMiddleware, async (c) => {
		try {
			const session = c.get("user");
			const { userId } = c.req.param();

			if (session.user.id !== userId) {
				return c.json(
					{
						error: "forbidden",
					},
					403,
				);
			}

			const res = await getTodoFromUserId(userId);
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
