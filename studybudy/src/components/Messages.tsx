"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface MessagesProps {
  subjectId: string
}

interface Message {
  message: string
}

const Messages: React.FC<MessagesProps> = ({ subjectId }) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/getMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectId }),
      })

      const data = await res.json()
      if (Array.isArray(data.data)) {
        console.log("MESSAGES!!", data.data)
        setMessages(data.data)
      } else {
        console.error("Unexpected response format:", data)
      }
    }

    if (subjectId) {
      fetchMessages()
    }
  }, [subjectId])

  return (
    <div className="flex flex-col space-y-4 p-6">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-slate-400 text-sm">No messages yet. Start your learning journey!</p>
        </div>
      ) : (
        messages.map((messageObj, index) => (
          <div key={index} className="ml-auto max-w-xs">
            <div className="bg-indigo-600/70 backdrop-blur-sm break-words text-white rounded-xl rounded-tr-sm p-3 shadow-md">
              {messageObj.message}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Messages

