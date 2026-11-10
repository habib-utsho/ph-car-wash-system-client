"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ImageIcon,
  Mail,
  UserRound,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
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
import { signUp } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

const MIN_PASSWORD_LENGTH = 8; // Better Auth's default minPasswordLength

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    const payload = { name, email, password, image };

    setIsLoading(true);
    try {
      const { data, error } = await signUp.email({
        name: name, // required, The name of the user.
        email: email, // required, The email address of the user.
        password: password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
        image: image || undefined, // An optional profile image of the user.
        callbackURL: "/", // An optional URL to redirect to after the user signs up.
      });

      if (error)
        return setError(error.message ?? "Could not create your account.");

      toast.add({
        title: `Hello ${data.user?.name}, Account created`,
        description: "Your account has been created successfully.",
      });
      router.push("/")
      console.log({ data, error });
      //   console.log("Sign up submitted:", { ...payload, password: "[hidden]" });
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
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join PH Car Wash to book washes and track your service history.
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

          <GoogleButton label="Sign up with Google" disabled={isLoading} />

          <FieldSeparator>or sign up with email</FieldSeparator>

          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <InputGroup className="h-10">
              <InputGroupAddon>
                <UserRound />
              </InputGroupAddon>
              <InputGroupInput
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </InputGroup>
          </Field>

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
            <FieldLabel htmlFor="image">Profile image URL</FieldLabel>
            <InputGroup className="h-10">
              <InputGroupAddon>
                <ImageIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="image"
                name="image"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/image.png"
                disabled={isLoading}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              required
              disabled={isLoading}
              aria-describedby="password-hint"
            />
            <FieldDescription id="password-hint">
              Must be at least {MIN_PASSWORD_LENGTH} characters.
            </FieldDescription>
          </Field>

          <Field data-invalid={passwordMismatch || undefined}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              disabled={isLoading}
              aria-invalid={passwordMismatch || undefined}
              aria-describedby={
                passwordMismatch ? "confirm-password-error" : undefined
              }
              onChange={() => passwordMismatch && setPasswordMismatch(false)}
            />
            {passwordMismatch && (
              <FieldError id="confirm-password-error">
                Passwords don&apos;t match.
              </FieldError>
            )}
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="terms"
              name="terms"
              required
              disabled={isLoading}
              className="data-checked:border-[#15295e] data-checked:bg-[#15295e]"
            />
            <FieldLabel htmlFor="terms" className="leading-snug font-normal">
              I agree to the Terms of Service and Privacy Policy
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
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-[#15295e] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
