import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore";
import { loginUser, registerUser } from "../api/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  loginSchema,
  registerSchema,
  type AuthFormValues,
} from "../schemas/authSchema";

interface LoginPageProps {
  mode?: "login" | "register";
}

export default function LoginPage({ mode = "login" }: LoginPageProps) {
  const isRegistering = mode === "register";
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const authMutation = useMutation({
    mutationFn: isRegistering ? registerUser : loginUser,
    onSuccess: (reply) => {
      login(reply.token, reply.user.email);
      navigate("/");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isRegistering ? registerSchema : loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: AuthFormValues) => authMutation.mutate(values);

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 text-2xl font-bold">
        {isRegistering ? "Create account" : "Login"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p role="alert" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            maxLength={72}
            {...register("password")}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <p role="alert" className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        {authMutation.isError && (
          <p role="alert" className="text-sm text-red-700">
            {authMutation.error.message}
          </p>
        )}
        <Button type="submit" disabled={authMutation.isPending}>
          {authMutation.isPending
            ? isRegistering
              ? "Creating account..."
              : "Signing in..."
            : isRegistering
              ? "Create account"
              : "Log In"}
        </Button>
      </form>
      <p className="mt-6 text-sm">
        {isRegistering ? (
          <>
            Already have an account? <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            No account yet? <Link to="/register">Register</Link>
          </>
        )}
      </p>
    </div>
  );
}
