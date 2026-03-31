import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Lock, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authClient, getSessionSafe } from "../lib/auth-client";

const signinSchema = z.object({
	name: z.string().optional(),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

type SigninData = z.infer<typeof signinSchema>;

export const Route = createFileRoute("/signin")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session, isPending } = authClient.useSession();

	const [error, setError] = React.useState<string | null>(null);
	const router = useRouter();

	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm<SigninData>({
		resolver: zodResolver(signinSchema),
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (session) {
		return router.navigate({
			to: "/todos",
		});
	}

	const handleLogin = async (formData: SigninData) => {
		try {
			const res = await authClient.signIn.email({
				email: formData.email,
				password: formData.password,
				callbackURL: "/todos",
			});
			if (res.error?.message) {
				throw new Error(res.error.message);
			}
			router.navigate({
				to: "/todos",
			});
			alert("Login successful!");
			setError(null);
		} catch (error) {
			console.error("Login failed:", error);
			setError(
				error instanceof Error
					? error.message
					: "Login failed. Please check your credentials and try again",
			);
		}
	};

	return (
		<div className="text-center text-2xl flex items-center gap-2 justify-center">
			<div className="card card-border bg-base-100 w-96">
				<div className="card-body">
					<h2 className="card-title text-center mx-auto ">Login</h2>
					<div className="mb-4 text-md space-y-2">
						<p>
							Enter your credentials to access your account and manage your
							todos. If you don't have an account, please sign up to get
							started!
						</p>

						<Link to="/signup" className="link text-accent">
							Don't have an account? Sign up here.
						</Link>
					</div>

					<form onSubmit={handleSubmit(handleLogin)}>
						<div className="space-y-4 mb-5">
							<label className="input">
								<User />
								<input
									type="text"
									required
									placeholder="Username"
									{...register("email")}
								/>
							</label>

							<label className="input">
								<Lock />
								<input
									type="password"
									required
									placeholder="Password"
									{...register("password")}
								/>
							</label>
						</div>

						<div>
							{errors.email && (
								<p className="text-error text-sm">{errors.email.message}</p>
							)}
							{errors.password && (
								<p className="text-error text-sm">{errors.password.message}</p>
							)}

							{error && <p className="text-error text-sm">{error}</p>}
						</div>

						<div className="card-actions mt-5">
							<button className="btn btn-primary w-full" type="submit">
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
