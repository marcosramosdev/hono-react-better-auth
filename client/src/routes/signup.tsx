import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	Link,
	Navigate,
	useRouter,
} from "@tanstack/react-router";
import { LockKeyhole, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "../lib/auth-client";

const signupSchema = z
	.object({
		name: z.string(),
		email: z.string().email("Invalid Email"),
		password: z
			.string()
			.min(8, "Needs to have more then 8 caracters")
			.regex(/[A-Z]/, "Needs a capitalize letter")
			.regex(/[a-z]/, "Needs uncapitalize letter")
			.regex(/[0-9]/, "Needs to have number"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords needs to match",
		path: ["confirmPassword"],
	});

type SignupData = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupData>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (formData: SignupData) => {
		try {
			console.log(formData);
			await authClient.signUp.email({
				name: formData.name,
				email: formData.email,
				password: formData.password,
				fetchOptions: {
					onSuccess: () => {
						router.navigate({
							to: "/signin",
						});
					},
				},
			});
		} catch (error) {
			console.error(error);
		}
	};
	const { data: session } = authClient.useSession();

	if (session) return <Navigate to="/todos" />;

	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="card card-border w-96 mx-auto bg-base-100 text-base-content"
			>
				<div className="card-body">
					<div className="card-title justify-center">Create an Account</div>

					<div className="space-y-4">
						{/* NAME */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<User size={20} />
								<label htmlFor="name">Name</label>
							</div>
							<input
								{...register("name")}
								type="text"
								placeholder="Full name"
								className="input w-full"
								id="name"
								required
							/>
							{errors.name && (
								<p className="text-error text-sm">{errors.name.message}</p>
							)}
						</div>

						{/* EMAIL */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<Mail size={20} />
								<label htmlFor="email">Email</label>
							</div>
							<input
								{...register("email")}
								type="email"
								placeholder="email@test.com"
								className="input w-full"
								id="email"
								required
							/>
							{errors.email && (
								<p className="text-error text-sm">{errors.email.message}</p>
							)}
						</div>

						{/* PASSWORD */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<LockKeyhole size={20} />
								<label htmlFor="password">Password</label>
							</div>
							<input
								{...register("password")}
								type="password"
								placeholder="Password"
								className="input w-full"
								id="password"
								required
							/>
							{errors.password && (
								<p className="text-error text-sm">{errors.password.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex gap-2">
								<LockKeyhole size={20} />
								<label htmlFor="confirmPassword">Confirm Password</label>
							</div>
							<input
								{...register("confirmPassword")}
								type="password"
								placeholder="Password"
								className="input w-full"
								id="confirmPassword"
								required
							/>
							{errors.confirmPassword && (
								<p className="text-error text-sm">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<button className="btn btn-primary w-full" type="submit">
							Sign up now
						</button>
					</div>
					<div>
						<p className="text-center mt-4">
							Already have an account?{" "}
							<Link to="/signin" className="link text-primary">
								Sign in here.
							</Link>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
}
