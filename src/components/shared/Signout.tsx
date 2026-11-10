"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const SignoutCompo = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };
  return (
    <button
      type="submit"
      className="w-full text-left"
      onClick={() => handleSignOut()}
    >
      Sign out
    </button>
  );
};

export default SignoutCompo;
