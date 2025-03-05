"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { data: session, status } = useSession();
  const [protectedContent, setProtectedContent] = useState<string | null>(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      //redirect("/");
    }

    if (session) {
      console.log("JWT Token:", session.accessToken);
      fetchProtectedData(session.accessToken);
    }
  }, [session, status]);

  const fetchProtectedData = async (token: string) => {
    const response = await fetch("/api/restricted", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.content) {
      setProtectedContent(data.content);
    } else {
      console.log("Unauthorized access");
      redirect("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="font-sembold">Welcome, {session?.user?.name}!</h1>
      {session?.user?.image ? (
        <img
          src={session.user.image}
          className="rounded-xl mt-5"
          alt="User Avatar"
        />
      ) : (
        <div className="h-[20vh] w-[20vw] bg-gray-200 rounded-full"></div>
      )}
      <Button className="mt-5" onClick={handleSignOut}>
        Logout
      </Button>
      {protectedContent && <p className="mt-5">{protectedContent}</p>}
    </div>
  );
};

export default HomePage;
