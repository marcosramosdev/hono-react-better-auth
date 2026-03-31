import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

export async function getSessionSafe() {
	try {
		return await authClient.getSession();
	} catch {
		return null;
	}
}
