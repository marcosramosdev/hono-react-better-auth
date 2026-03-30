import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { hc } from "hono/client";
import { CircleX } from "lucide-react";
import TodoForm from "#/components/TodoForm";
import type { AppType } from "../../../server/index";
import { authClient } from "../lib/auth-client";

const client = hc<AppType>("/");

export const Route = createFileRoute("/todos")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session, isPending: isUserPending } = authClient.useSession();

	const {
		data: todos,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["todos", session?.user.id],
		queryFn: async () => {
			const res = await client.api.todos.user[":userId"].$get({
				param: {
					userId: session?.user.id as string,
				},
			});
			if (!res.ok) {
				throw Error("failed to fetch todos from client");
			}
			return await res.json();
		},
	});

	if (isUserPending) {
		return <div>Loading...</div>;
	}

	if (!session) {
		return (
			<div className="text-center text-2xl flex items-center gap-2 justify-center flex-col">
				<div className="flex items-center gap-2">
					<p>You need to be logged in to see your todos </p>
					<CircleX size={30} color="red" />
				</div>
				<Link to="/signup" className="link text-accent">
					Click here to create an account or login if you already have one
				</Link>
			</div>
		);
	}

	if (isError)
		return (
			<div className="text-center text-2xl flex items-center gap-2 justify-center">
				Error to fetch todos, reload page <CircleX size={30} color="red" />
			</div>
		);

	const todoListComponent = () => {
		return (
			<ul>
				{todos?.map((todo) => (
					<li key={todo.id}>
						<div className="flex w-full justify-between items-center border-2 mb-2 p-10 rounded-2xl">
							<div>
								<p
									className={`uppercase ${todo.complete ? "line-through" : ""} `}
								>
									{todo.title}
								</p>
								<p className="text-base-content">{todo.description}</p>
							</div>
							<div>
								<input
									type="checkbox"
									checked={todo.complete as boolean}
									className="checkbox"
									onChange={() => console.log("checked")}
								/>
							</div>
						</div>
					</li>
				))}
			</ul>
		);
	};

	return (
		<div>
			<div className="mb-5 ">
				<h1 className="text-center uppercase text-2xl md:text-3xl font-bold tracking-wider">
					Todos Page
				</h1>
			</div>
			<div>
				<TodoForm />
			</div>
			<div>
				{isPending ? (
					<div className="text-center">
						<span className="loading loading-spinner loading-xl"></span>
					</div>
				) : (
					todoListComponent()
				)}
			</div>
		</div>
	);
}
