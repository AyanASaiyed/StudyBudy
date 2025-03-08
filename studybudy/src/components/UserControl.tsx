import React, { useState, useRef, useEffect } from "react";

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
    console.log(subjectId);
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="mt-5 bottom-10 absolute">
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="rounded-full w-[30vw] max-h-[20vh] border-1 border-white p-5 resize-none overflow-auto"
          placeholder="Enter Message"
          value={message}
          onChange={handleChange}
          rows={1}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-teal-700 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default UserControl;
