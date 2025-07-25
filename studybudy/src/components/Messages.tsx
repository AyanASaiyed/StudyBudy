"use client";

import supabase from "@/lib/supabase";
import type React from "react";
import { useEffect, useState } from "react";

interface MessagesProps {
  subjectId: string;
}

interface Message {
  message: string;
  senderid: string; // Add senderid to the interface
}

const Messages: React.FC<MessagesProps> = ({ subjectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (subjectId != "add-sub") {
        const res = await fetch("/api/getMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subjectId }),
        });

        const data = await res.json();
        if (Array.isArray(data.data)) {
          setMessages(data.data);
        } else {
          console.error("Unexpected response format:", data);
        }
      }
    };

    if (subjectId) {
      fetchMessages();
    }

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [subjectId]);

  return (
    <div className="flex flex-col space-y-4 p-6">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-slate-400 text-sm">
            No messages yet. Start your learning journey!
          </p>
        </div>
      ) : (
        messages.map((messageObj, index) => (
          <div
            key={index}
            className={`${
              messageObj.senderid === "00000000-0000-0000-0000-000000000000"
                ? "mr-auto max-w-2xl" // Align left for GEMINI
                : "ml-auto max-w-xs" // Align right for user
            } max-w-xs`}
          >
            <div
              className={`backdrop-blur-sm break-words text-white rounded-xl p-3 shadow-md ${
                messageObj.senderid === "00000000-0000-0000-0000-000000000000"
                  ? "bg-slate-700/70 rounded-tl-sm" // Different color for GEMINI
                  : "bg-indigo-600/70 rounded-tr-sm" // Original style for user
              }`}
            >
              {messageObj.message}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
