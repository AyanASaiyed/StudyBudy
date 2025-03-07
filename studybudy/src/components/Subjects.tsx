"use client";

import { useSession } from "next-auth/react";
import type React from "react";
import { useEffect, useState } from "react";

const Subjects = () => {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject_name, setsubject_name] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getSubjects");
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setSubjects(
            data.data.map((item: { subject_name: string }) => item.subject_name)
          );
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubjectChange = (index: number) => {
    setEditIndex(index);
    setsubject_name(index < subjects.length ? subjects[index] : "");
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
        newSubjects[editIndex] = subject_name;
        setSubjects(newSubjects);
      } else {
        setSubjects([...subjects, subject_name]);
      }
    }

    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject_name }),
    });

    const data = await res.json();
    if (data.error) {
      console.error("Error saving subject:", data.error);
    } else {
      setsubject_name("");
      setIsModalOpen(false);
      setEditIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex flex-col gap-4 items-center">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="h-[10vh] w-[6vw] bg-neutral-900 rounded-full hover:bg-teal-900 hover:scale-105 transition-all shadow-md shadow-teal-800 border border-white flex items-center justify-center cursor-pointer"
            onClick={() => handleSubjectChange(index)}
          >
            {subject}
          </div>
        ))}

        <div
          className="h-[10vh] w-[6vw] bg-neutral-900 rounded-full hover:bg-teal-900 hover:scale-105 transition-all border-1 shadow-md shadow-teal-800 border-white flex items-center justify-center cursor-pointer"
          onClick={() => handleSubjectChange(subjects.length)}
        >
          <span className="text-6xl font-extrabold text-white flex relative top-[-1vh]">
            +
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-4 w-80 shadow-xl border border-teal-700">
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
                value={subject_name}
                onChange={(e) => setsubject_name(e.target.value)}
                className="w-full p-2 bg-neutral-900 text-white rounded border border-neutral-800 focus:border-teal-500 focus:outline-none"
                placeholder="Enter subject name"
                autoFocus
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1 bg-neutral-900 text-white rounded hover:bg-neutral-800"
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
