import { authClient } from "#/lib/auth-client";

export const useAuth = () => {
	const { data: session, isPending, error } = authClient.useSession();

	return {
		user: session?.user || null,
		isAuthenticated: !!session?.user,
		isLoading: isPending,
		error,
	};
};
