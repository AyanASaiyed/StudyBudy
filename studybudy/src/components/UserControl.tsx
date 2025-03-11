"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

interface UserControlProps {
  subjectId: string | null;
}

const UserControl: React.FC<UserControlProps> = ({ subjectId }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !subjectId) return;

    const res = await fetch("/api/saveMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, subjectId }),
    });

    const data = await res.json();
    if (data.error) {
      console.error("Error saving message:", data.error);
    } else {
      setMessage("");
    }
  };

  return (
    <div className="w-[60vw]">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-center"
      >
        <textarea
          ref={textareaRef}
          className="w-full overflow-y-auto rounded-xl bg-slate-800/70 max-h-[10vh] backdrop-blur-sm border border-slate-700/50 p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none overflow-hidden shadow-lg"
          placeholder={
            subjectId
              ? "Ask anything about your subject..."
              : "Select a subject to start chatting..."
          }
          value={message}
          onChange={handleChange}
          rows={1}
          disabled={!subjectId}
        />
        <button
          type="submit"
          disabled={!subjectId || !message.trim()}
          className={`absolute right-2 bottom-2 p-3 rounded-full transition-colors ${
            !subjectId || !message.trim()
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default UserControl;
