import { Trash2 } from "lucide-react";
import { useCompleteTodo, useDeleteTodo } from "#/hook/useTodos";
import { authClient } from "#/lib/auth-client";
import type { todos } from "./TodoList";

type Props = {
	todo: todos;
};

function TodoItem({ todo }: Props) {
	const { data: session } = authClient.useSession();

	const { mutate: completeMutate, isPending: isCompleting } = useCompleteTodo(
		session?.user.id,
	);
	const { mutate: deleteMutate, isPending: isDeleting } = useDeleteTodo(
		session?.user.id,
	);

	const handleComplete = () => {
		completeMutate({ todoId: todo.id, nextComplete: !todo.complete });
	};

	const handleDeleteTodo = () => {
		deleteMutate(todo.id);
	};

	return (
		<li key={todo.id}>
			<div className="flex w-full justify-between items-center border-2 mb-2 p-10 rounded-2xl">
				<div>
					<p className={`uppercase ${todo.complete ? "line-through" : ""} `}>
						{todo.title}
					</p>
					<p className="text-base-content">{todo.description}</p>
					<p className="text-base-content">
						<span>Created at: </span>
						{new Date(todo.createdAt as string).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
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
