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
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
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
      <div className="flex flex-col items-center justify-center h-screen font-mono text-white bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="p-8 rounded-lg bg-slate-800/70 backdrop-blur-sm border border-slate-700/50">
          <p className="text-xl">Loading...</p>
          <p className="text-sm text-slate-400 mt-2">
            (refresh if it's taking too long.)
          </p>
        </div>
      </div>
    );
  }

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_name: newSubjectName }),
      });

      const data = await res.json();
      if (data.error) {
        console.error("Error creating subject:", data.error);
      } else {
        setNewSubjectName("");
        setCurrentSubjectId(null);
      }
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  return (
    <div className="overflow-hidden relative flex h-screen text-white bg-gradient-to-br from-slate-900 to-indigo-950">
      {/* Sidebar */}
      <div className="h-screen w-[9vw] bg-slate-800/40 backdrop-blur-sm border-r border-slate-700/50 overflow-auto z-10">
        <Subjects setCurrentSubjectId={setCurrentSubjectId} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header with Avatar */}
        <div className="absolute top-2 right-4 z-20" ref={avatarRef}>
          <Avatar
            className="cursor-pointer border-2 border-indigo-500/50 hover:border-indigo-400 transition-all shadow-lg size-12"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <AvatarImage src={session?.user?.image!} />
            <AvatarFallback className="bg-indigo-600">
              {session?.user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 overflow-hidden z-20"
            >
              <div className="p-4 border-b border-slate-700/50">
                <p className="text-sm font-semibold">{session?.user?.name}</p>
                <p className="text-xs text-slate-400">{session?.user?.email}</p>
              </div>
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-slate-700/50 hover:text-indigo-400"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 pt-16">
          <div className="h-[78vh] bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-y-auto shadow-lg">
            {currentSubjectId === null ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-white text-2xl font-light">
                  Select or Create a subject to start learning! 🥳
                </p>
              </div>
            ) : (
              <Messages subjectId={currentSubjectId ?? ""} />
            )}
          </div>
        </div>

        {/* User Control */}
        <div className="p-4 flex justify-center">
          <UserControl subjectId={currentSubjectId} />
        </div>
      </div>
      {currentSubjectId === "add-sub" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/90 rounded-lg p-6 w-80 border border-slate-700/50">
            <h3 className="text-lg font-medium text-white mb-4">
              Create New Subject
            </h3>
            <form onSubmit={handleAddSubject}>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSubjectId(null);
                    setNewSubjectName("");
                  }}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-500 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
