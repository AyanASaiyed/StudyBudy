"use client";

import { useSession } from "next-auth/react";
import type React from "react";
import { useState } from "react";
import { json } from "stream/consumers";

const Subjects = () => {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleSubjectChange = (index: number) => {
    setEditIndex(index);
    setInputValue(index < subjects.length ? subjects[index] : "");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editIndex !== null) {
      if (editIndex < subjects.length) {
        const newSubjects = [...subjects];
        newSubjects[editIndex] = inputValue;
        setSubjects(newSubjects);
      } else {
        setSubjects([...subjects, inputValue]);
      }
    }

    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ inputValue }),
    });

    const data = await res.json();
    console.log("TOKENN", session?.accessToken);
    console.log("DATA!!", data);
    setInputValue(data);

    setIsModalOpen(false);
    setEditIndex(null);
    setInputValue("");
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex flex-col gap-4 items-center">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="h-[10vh] w-[6vw] bg-neutral-700 rounded-xl hover:bg-neutral-800 hover:scale-105 transition-all shadow-lg shadow-teal-800 border border-white flex items-center justify-center cursor-pointer"
            onClick={() => handleSubjectChange(index)}
          >
            {subject}
          </div>
        ))}

        <div
          className="h-[10vh] w-[6vw] bg-neutral-700 rounded-xl hover:bg-neutral-800 hover:scale-105 transition-all shadow-lg shadow-teal-800 border border-white flex items-center justify-center cursor-pointer"
          onClick={() => handleSubjectChange(subjects.length)}
        >
          <span className="text-6xl font-extrabold text-white flex relative top-[-1vh]">
            +
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-4 w-80 shadow-xl border border-teal-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">
                {editIndex !== null && editIndex < subjects.length
                  ? "Edit Subject"
                  : "New Subject"}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-teal-500 focus:outline-none"
                placeholder="Enter subject name"
                autoFocus
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1 bg-neutral-700 text-white rounded hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
