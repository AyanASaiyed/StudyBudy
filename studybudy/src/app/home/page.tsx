"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-sembold">Welcome, {session?.user?.name}!</h1>
      {session?.user?.image ? (
        <img
          src={session.user.image}
          className="rounded-xl mt-5"
          alt="User Avatar"
        />
      ) : (
        <div className="h-[20vh] w-[20vw] bg-gray-200 rounded-full"></div> // Optional: You can show a placeholder or a div in case there's no image
      )}
      <Button className="mt-5" onClick={() => signOut({ callbackUrl: "/" })}>
        Logout
      </Button>
    </div>
  );
};

export default HomePage;
