import type { auth } from "../lib/auth";

export type HonoEnv = {
	Variables: {
		user: typeof auth.$Infer.Session;
		session: typeof auth.$Infer.Session.session;
	};
};
