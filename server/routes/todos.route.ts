import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import {
	createTodo,
	deleteTodo,
	getTodoFromUserId,
	getTodos,
	updateTodoComplete,
} from "../db/queries/todos.queries";
import { authMiddleware } from "../middleware/authMiddleware";
import type { HonoEnv } from "../types";

export const todosRoute = new Hono<HonoEnv>()
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
				const session = c.get("session");
				const createdTodo = await createTodo({
					title,
					description,
					userId: session.userId,
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
	.patch(
		"/:id/complete",
		authMiddleware,
		zValidator("param", z.object({ id: z.string().uuid() })),
		zValidator("json", z.object({ complete: z.boolean() })),
		async (c) => {
			try {
				const { id } = c.req.valid("param");
				const { complete } = c.req.valid("json");
				const session = c.get("session");

				const updatedTodo = await updateTodoComplete({
					id,
					userId: session.userId,
					complete,
				});

				if (!updatedTodo) {
					return c.json(
						{
							error: "todo not found",
						},
						404,
					);
				}

				return c.json(
					{
						message: "todo completion updated successfully",
						todoData: updatedTodo,
					},
					200,
				);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						error: "failed to update todo completion",
						details: error instanceof Error ? error.message : null,
					},
					500,
				);
			}
		},
	)
	.delete(
		"/:id",
		authMiddleware,
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			try {
				const { id } = c.req.valid("param");
				const session = c.get("session");

				const deletedTodo = await deleteTodo({
					id,
					userId: session.userId,
				});
				if (!deletedTodo) {
					return c.json(
						{
							error: "todo not found",
						},
						404,
					);
				}
				return c.json(
					{
						message: "todo deleted successfully",
						todoData: deletedTodo,
					},
					200,
				);
			} catch (error) {
				console.error(error);
				return c.json(
					{
						error: "failed to delete todo",
						details: error instanceof Error ? error.message : null,
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
