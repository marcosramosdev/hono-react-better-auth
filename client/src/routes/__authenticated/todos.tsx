import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { hc } from "hono/client";
import { CircleX } from "lucide-react";
import React, { useMemo } from "react";
import TodoForm from "#/components/TodoForm";
import TodoList from "#/components/TodoList";
import type { AppType } from "../../../../server/index";

const client = hc<AppType>("/");

export const Route = createFileRoute("/__authenticated/todos")({
	component: RouteComponent,
});

type TodoFilter = "all" | "active" | "completed";
type Todo = {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	complete: boolean | null;
	createdAt: string | null;
	updatedAt: string | null;
};

function RouteComponent() {
	const session = Route.useRouteContext({
		select: (ctx) => ctx.session,
	});

	const userId = session?.data?.user.id;

	const [todoFilter, setTodoFilter] = React.useState<TodoFilter>("all");

	// o enable do usequery desabilita o fetch automatico quando eu não tenho o userId, dessa forma que posso rodar o query de forma condicional e evitar erros de fetch por conta do userId ser undefined
	const {
		data: todos,
		isPending,
		isError,
	} = useQuery<Todo[]>({
		queryKey: ["todos", userId],
		queryFn: async () => {
			const res = await client.api.todos.user[":userId"].$get({
				param: {
					userId: userId as string,
				},
			});

			if (!res.ok) {
				throw Error("failed to fetch todos from client");
			}
			return res.json();
		},
		enabled: !!userId,
	});

	const filteredTodos = useMemo(() => {
		if (!todos) {
			return [];
		}

		switch (todoFilter) {
			case "active":
				return todos.filter((todo) => !todo.complete);
			case "completed":
				return todos.filter((todo) => !!todo.complete);
			default:
				return todos;
		}
	}, [todoFilter, todos]);

	if (!userId) {
		return (
			<div className="text-center text-2xl flex flex-col items-center gap-2 justify-center">
				<p>Please log in to view your todos</p>
				<div className="flex items-center gap-2">
					<Link to="/signin" className="link text-accent">
						sign in
					</Link>
					<span>/</span>
					<Link to="/signup" className="link text-accent">
						sign up
					</Link>
				</div>
			</div>
		);
	}

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError)
		return (
			<div className="text-center text-2xl flex items-center gap-2 justify-center">
				Error to fetch todos, reload page <CircleX size={30} color="red" />
			</div>
		);

	return (
		<div>
			<div className="mb-5 ">
				<h1 className="text-center uppercase text-2xl md:text-3xl font-bold tracking-wider">
					Todos Page
				</h1>
			</div>
			<div>
				<TodoForm />
				<div className="w-full flex justify-between border-2 p-2 mb-5 rounded-2xl">
					<button
						className={`${todoFilter === "all" && "font-bold bg-accent text-accent-content"}  rounded-lg px-3 py-1`}
						onClick={() => setTodoFilter("all")}
						type="button"
					>
						All
					</button>
					<button
						className={`${todoFilter === "active" && "font-bold bg-accent text-accent-content rounded-lg px-3 py-1"}`}
						onClick={() => setTodoFilter("active")}
						type="button"
					>
						Active
					</button>
					<button
						className={`${todoFilter === "completed" && "font-bold bg-accent text-accent-content rounded-lg px-3 py-1"}`}
						onClick={() => setTodoFilter("completed")}
						type="button"
					>
						Completed
					</button>
				</div>
			</div>
			<div>
				{isPending ? (
					<div className="text-center">
						<span className="loading loading-spinner loading-xl"></span>
					</div>
				) : (
					<TodoList todos={filteredTodos} />
				)}
			</div>
		</div>
	);
}
