import { createFileRoute, useRouter } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/signin")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (session) {
		return router.navigate({
			to: "/todos",
		});
	}

	return <div>login page</div>;
}
