import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/__authenticated")({
	beforeLoad: async () => {
		const session = await authClient.getSession({});

		if (!session.data?.user) {
			throw redirect({
				to: "/signup",
			});
		}

		return { session };
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return <Outlet />;
}
