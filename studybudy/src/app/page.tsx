"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (data) {
        setUsers(data);
        console.log(data);
      }

      if (error) {
        console.log("Error Fetching users from Supabase: ", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-teal-400 font-bold text-5xl">StudyBudy</h1>
      <p className="mt-5 text-2xl font-extralight">
        Your very own personal AI study buddy📝!
      </p>
      <Button size="lg" className="text-lg mt-5 text-black font-semibold">
        Login with Google
      </Button>
      <div className="text-white font-extrabold">
        {users.map((user) => (
          <p key={user.id}>{user.full_name}</p>
        ))}
      </div>
    </div>
  );
}
