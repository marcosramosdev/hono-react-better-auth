import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import { Trash2 } from "lucide-react";
import { authClient } from "#/lib/auth-client";
import type { AppType } from "../../../server/index";
import type { todos } from "./TodoList";

const client = hc<AppType>("/", {
	init: {
		credentials: "include",
	},
});

type Props = {
	todo: todos;
};

function TodoItem({ todo }: Props) {
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	const { mutate: completeMutate, isPending: isCompleting } = useMutation({
		mutationFn: async (nextComplete: boolean) => {
			const res = await client.api.todos[":id"].complete.$patch({
				param: {
					id: todo.id,
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
				queryKey: ["todos", session?.user.id],
			});
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await client.api.todos[":id"].$delete({
				param: {
					id: todo.id,
				},
			});
			if (!res.ok) {
				throw Error("failed to delete todo");
			}
			return res.json();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["todos", session?.user.id],
			});
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleComplete = () => {
		completeMutate(!todo.complete);
	};

	const handleDeleteTodo = () => {
		deleteMutate();
	};

	return (
		<li key={todo.id}>
			<div className="flex w-full justify-between items-center border-2 mb-2 p-10 rounded-2xl">
				<div>
					<p className={`uppercase ${todo.complete ? "line-through" : ""} `}>
						{todo.title}
					</p>
					<p className="text-base-content">{todo.description}</p>
				</div>
				<div className="flex items-center">
					<input
						type="checkbox"
						checked={todo.complete as boolean}
						className="checkbox"
						onChange={handleComplete}
						disabled={isCompleting || isDeleting}
					/>
					<button
						className="btn btn-soft btn-circle btn-error ml-5"
						onClick={handleDeleteTodo}
						disabled={isCompleting || isDeleting}
					>
						<Trash2 />
					</button>
				</div>
			</div>
		</li>
	);
}

export default TodoItem;
