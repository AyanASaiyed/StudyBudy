"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Messages from "../../components/Messages";
import UserControl from "../../components/UserControl";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import Subjects from "../../components/Subjects";

const HomePage = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <h1 className="font-semibold">Welcome, {session?.user?.name}!</h1>
      </div>
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div ref={avatarRef}>
          <Avatar
            className="shadow-black border-teal-400 border-1 shadow-sm size-12 cursor-pointer hover:border-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <AvatarImage src={session?.user?.image!} />
            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-neutral-900 border border-teal-400 overflow-hidden z-10"
            >
              <div className="p-4 border-b border-neutral-800">
                <p className="text-sm font-semibold">{session?.user?.name}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {session?.user?.email}
                </p>
              </div>
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-neutral-800 hover:text-teal-400"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-screen left-0 w-[9vw] rounded-r-lg bg-neutral-950 absolute shadow-black shadow-xl border-r-1 border-teal-400 overflow-hidden">
        <Subjects setCurrentSubjectId={setCurrentSubjectId} />{" "}
      </div>
      <div className="flex flex-col items-center justify-center">
        <section className="bg-neutral-950 border-teal-400 border-1 h-[80vh] mb-15 w-[80vw] ml-15 rounded-xl">
          <Messages subjectId={currentSubjectId ?? ''} />
        </section>
        <section className="mt-5 flex flex-col items-center justify-center">
          <UserControl subjectId={currentSubjectId} />{" "}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
