"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();

  const googleSignIn = async () => {
    const res = await signIn("google", { callbackUrl: "/home" });
    if (res?.ok) {
      router.push("/home");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-teal-400 font-bold text-5xl">StudyBudy</h1>
      <p className="mt-5 text-2xl fonta-extralight text-white">
        Your very own personal AI study buddy📝!
      </p>
      <Button
        size="lg"
        className="text-lg mt-5 text-black font-semibold"
        onClick={googleSignIn}
      >
        Login with Google
      </Button>
    </div>
  );
}
