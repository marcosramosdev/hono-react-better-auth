import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { hc } from "hono/client";
import type { AppType } from "../../../server/index";

export const Route = createFileRoute("/")({ component: App });

const client = hc<AppType>("/");

function App() {
	const {
		data: todos,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await client.api.todos.$get();
			if (!res.ok) {
				throw new Error("failed to fetch todos");
			}

			return await res.json();
		},
	});

	const todoList = () => {
		return (
			<ul>
				{todos?.map((todo) => (
					<li key={todo.id}>{todo.title}</li>
				))}
			</ul>
		);
	};

	if (error) {
		return <div>failed to fetch todos</div>;
	}

	return (
		<main>
			<section>
				<h1>Hello from vite</h1>
				<div>{isLoading && <p>fetching todos</p>}</div>
				<div>{todoList()}</div>
			</section>
		</main>
	);
}
