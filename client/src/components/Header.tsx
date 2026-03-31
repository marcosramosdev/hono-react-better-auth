import { Link, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "#/lib/auth-client";

function Header() {
	const router = useRouter();
	const [user, setUser] = useState<string | undefined>();

	useEffect(() => {
		const fetchUser = async () => {
			const currentUser = await authClient.getSession();
			if (currentUser) {
				setUser(currentUser.data?.user.id);
			}
			return;
		};
		fetchUser();

		console.log(user);
	}, [user]);

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.reload();
					router.navigate({
						to: "/signin",
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
				{!user && (
					<>
						<div>
							<Link to="/signup">Sign Up</Link>
						</div>
						<div>
							<Link to="/signin">Login</Link>
						</div>
					</>
				)}
				{user && (
					<div>
						<button type="button" onClick={handleLogout}>
							<LogOut />
						</button>
					</div>
				)}
			</div>
		</header>
	);
}

export default Header;
