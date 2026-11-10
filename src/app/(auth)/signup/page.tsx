import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account | PH Car Wash",
  description:
    "Create a PH Car Wash account to book washes and track your service history.",
};

const SignupPage = () => {
  return <SignupForm />;
};

export default SignupPage;
