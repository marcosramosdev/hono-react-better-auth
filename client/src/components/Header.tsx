import { Link, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { authClient } from "#/lib/auth-client";

function Header() {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.navigate({
						to: "/about",
					});
				},
			},
		});
	};

	return (
		<header>
			<div className="w-full flex justify-between p-10 font-bold text-lg border-b-2">
				<div>
					<Link to="/">Home</Link>
				</div>
				<div>
					<Link to="/todos">Todos</Link>
				</div>

				<div>
					<Link to="/about">About</Link>
				</div>
				<div>
					<Link to="/signup">Sign Up</Link>
				</div>

				<div>
					<Link to="/signin">Login</Link>
				</div>

				<div>
					<button type="button" onClick={handleLogout}>
						<LogOut />
					</button>
				</div>
			</div>
		</header>
	);
}

export default Header;
