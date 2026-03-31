import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionSafe } from "../lib/auth-client";

export const Route = createFileRoute("/__authenticated")({
	beforeLoad: async () => {
		const session = await getSessionSafe();

		if (!session) {
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
