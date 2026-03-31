import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { AppType } from "../../../server/index";

const client = hc<AppType>("/", {
	init: {
		credentials: "include",
	},
});

function useDeleteTodo(userId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (todoId: string) => {
			const res = await client.api.todos[":id"].$delete({
				param: {
					id: todoId,
				},
			});
			if (!res.ok) {
				throw Error("failed to delete todo");
			}
			return res.json();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["todos", userId],
			});
		},
		onError: (error) => {
			console.error(error);
		},
	});
}

function useCompleteTodo(userId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			todoId,
			nextComplete,
		}: {
			todoId: string;
			nextComplete: boolean;
		}) => {
			const res = await client.api.todos[":id"].complete.$patch({
				param: {
					id: todoId,
				},
				json: {
					complete: nextComplete,
				},
			});

			if (!res.ok) {
				throw Error("failed to update todo completion");
			}

			return res.json();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["todos", userId],
			});
		},
		onError: (error) => {
			console.error(error);
		},
	});
}

export  { useCompleteTodo, useDeleteTodo };

