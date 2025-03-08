import React, { useEffect, useState } from "react";

interface MessagesProps {
  subjectId: string;
}

interface Message {
  message: string;
}

const Messages: React.FC<MessagesProps> = ({ subjectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/getMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectId }),
      });

      const data = await res.json();
      if (Array.isArray(data.data)) {
        console.log("MESSAGES!!", data.data);
        setMessages(data.data);
      } else {
        console.error("Unexpected response format:", data);
      }
    };

    if (subjectId) {
      fetchMessages();
    }
  }, [subjectId]);

  return (
    <div>
      {messages.map((messageObj, index) => (
        <div key={index}>{messageObj.message}</div>
      ))}
    </div>
  );
};

export default Messages;
