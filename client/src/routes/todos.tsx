import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { hc } from "hono/client";
import { CircleX } from "lucide-react";
import type { AppType } from "../../../server/index";

const client = hc<AppType>("/");

export const Route = createFileRoute("/todos")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		data: todos,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await client.api.todos[":amount"].$get({
				param: {
					amount: "5",
				},
			});
			if (!res.ok) {
				throw Error("failed to fetch todos from client");
			}
			return await res.json();
		},
	});

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
		<div className="max-w-xl mx-auto">
			<div className="mb-5 ">
				<h1 className="text-center uppercase text-2xl md:text-3xl font-bold tracking-wider">
					Todos Page
				</h1>
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
