import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import { SquareCheckBig, Type } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authClient } from "#/lib/auth-client";
import type { AppType } from "../../../server";

const client = hc<AppType>("/", {
	init: {
		credentials: "include",
	},
});

const todoSchema = z.object({
	title: z.string().min(1, "Title is required."),
	description: z.string().optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

function TodoForm() {
	const { data } = authClient.useSession();
	const user = data?.user;
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TodoFormData>({
		resolver: zodResolver(todoSchema),
	});

	const { mutate: todoMutate, isPending } = useMutation({
		mutationFn: async (data: TodoFormData) => {
			const res = await client.api.todos.$post({
				json: {
					title: data.title,
					description: data.description,
				},
			});

			if (!res.ok) {
				throw new Error("Failed to create todo");
			}
		},
		onError: (error) => {
			console.error("Failed to create todo:", error);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["todos", user?.id],
			});
			reset({
				title: "",
				description: "",
			});
		},
	});
	const handleAddTodo = (formData: TodoFormData) => {
		todoMutate(formData);
	};

	return (
		<div className="card card-border bg-base-100 w-full shadow-xl my-10">
			<div className="card-body">
				<h2 className="card-title">Create Todo</h2>
				<p>add a new todo to your list and keep track of your tasks.</p>

				<form onSubmit={handleSubmit(handleAddTodo)} className="w-full">
					<div className="w-full flex flex-col gap-4 my-10">
						<label className="input validator w-full">
							<SquareCheckBig />
							<input
								type="text"
								placeholder="Todo Title"
								{...register("title")}
								required
								disabled={isPending}
							/>
						</label>
						{errors.title && (
							<p className="text-error text-sm">Title is required</p>
						)}
						<label className="input validator w-full">
							<Type />
							<input
								type="text"
								placeholder="description"
								{...register("description")}
								disabled={isPending}
							/>
						</label>
					</div>

					<div className="card-actions justify-end">
						<button className="btn btn-primary" type="submit">
							Add todo
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default TodoForm;
