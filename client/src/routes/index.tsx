import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { hc } from "hono/client";
import type { AppType } from "../../../server/index";

export const Route = createFileRoute("/")({ component: App });

const client = hc<AppType>("/");

function App() {
	const { data: users } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await client.api.people.$get();
			const data = await res.json();
			return data;
		},
	});
	function listOfUsers() {
		return (
			<ul>
				{users?.map((user) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		);
	}

	return (
		<main>
			<section>
				<h1>Hello from vite</h1>
				<div>{!users && <p>fetching users</p>}</div>
				<div>{listOfUsers()}</div>
			</section>
		</main>
	);
}
