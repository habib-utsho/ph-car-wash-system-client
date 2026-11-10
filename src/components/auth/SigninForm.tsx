"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";
import { signIn } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    };

    setIsLoading(true);
    try {
      const { data, error } = await signIn.email(payload);
      if (error) return setError(error.message ?? "Invalid email or password.");
      console.log({ data, error });
      if (data?.user) {
        toast.add({
          title: `Hello ${data.user?.name}, welcome back!`,
          description: "You have been signed in successfully.",
        });
        router.push("/");
      }
      console.log("Sign in submitted:", { ...payload, password: "[hidden]" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[#15295e] sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to book a wash and manage your appointments.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup className="h-10">
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </InputGroup>
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#15295e] underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              defaultChecked
              disabled={isLoading}
              className="data-checked:border-[#15295e] data-checked:bg-[#15295e]"
            />
            <FieldLabel htmlFor="rememberMe" className="font-normal">
              Keep me signed in
            </FieldLabel>
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-10 w-full bg-[#15295e] text-sm text-white hover:bg-[#1e3a80]"
          >
            {isLoading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>

          <FieldSeparator>or</FieldSeparator>

          <GoogleButton disabled={isLoading} />
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#15295e] underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
