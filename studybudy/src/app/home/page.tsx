"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Subjects from "../../components/Subjects";
import { useEffect } from "react";

const HomePage = () => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const fetchProtectedData = async (token: string) => {
      const response = await fetch("/api/restricted", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        console.log("Unauthorized access");
        redirect("/");
      }
    };

    if (session?.accessToken) {
      fetchProtectedData(session.accessToken);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="text-white flex flex-col items-center justify-center h-screen font-mono">
        Loading...
        <p>(refresh if it's taking too long.)</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-white">
      <Avatar className="absolute top-4 right-4 shadow-black border-teal-400 border-1 shadow-xl size-12">
        <AvatarImage src={session?.user?.image!} />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <h1 className="font-semibold">Welcome, {session?.user?.name}!</h1>
      <div className="h-screen left-0 w-[9vw] rounded-r-lg bg-neutral-800 absolute shadow-black shadow-xl border-1 border-teal-400 overflow-y-scroll">
        <Subjects />
      </div>
      <Button className="mt-5" onClick={handleSignOut}>
        Logout
      </Button>
    </div>
  );
};

export default HomePage;
