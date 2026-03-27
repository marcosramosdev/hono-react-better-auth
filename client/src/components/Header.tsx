import { Link } from "@tanstack/react-router";

function Header() {
	return (
		<header>
			<div className="w-full flex justify-between p-10">
				<div>
					<Link to="/">Home</Link>
				</div>
				<div>
					<Link to="/todos">Todos</Link>
				</div>

				<div>
					<Link to="/about">About</Link>
				</div>
			</div>
		</header>
	);
}

export default Header;
