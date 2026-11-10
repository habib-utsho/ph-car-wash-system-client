import type { Metadata } from "next";
import SigninForm from "@/components/auth/SigninForm";

export const metadata: Metadata = {
    title: "Sign in | PH Car Wash",
    description: "Sign in to your PH Car Wash account to book and manage car washes.",
};

const SigninPage = () => {
    return <SigninForm />;
};

export default SigninPage;
