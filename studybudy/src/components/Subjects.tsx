"use client";

import type React from "react";
import { useEffect, useState } from "react";

interface SubjectsProps {
  setCurrentSubjectId: (id: string) => void;
}

const Subjects: React.FC<SubjectsProps> = ({ setCurrentSubjectId }) => {
  const [subjects, setSubjects] = useState<
    { id: string; subject_name: string }[]
  >([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getSubjects");
        const data = await res.json();
        if (Array.isArray(data.data)) {
          console.log("SUBJECTS!!", data.data);
          setSubjects(data.data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubjectChange = (id: string) => {
    setSelectedSubjectId(id);
    setCurrentSubjectId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex flex-col gap-4 items-center">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`h-[10vh] w-[6vw] rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-md border border-slate-700/50 hover:scale-105
              ${
                selectedSubjectId === subject.id
                  ? "bg-indigo-600/70 text-white"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70"
              }`}
            onClick={() => handleSubjectChange(subject.id)}
          >
            <span className="font-medium text-sm">{subject.subject_name}</span>
          </div>
        ))}

        <div
          className="h-[10vh] w-[6vw] rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-md border border-slate-700/50 bg-slate-800/70 text-slate-300 hover:bg-indigo-600/40 hover:text-white hover:scale-105"
          onClick={() => handleSubjectChange("add-sub")}
        >
          <span className="text-4xl font-extrabold flex relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="size-8"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
