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
    setCurrentSubjectId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex flex-col gap-4 items-center">
        {subjects.map((subject) => (
          <li
            key={subject.id}
            className="h-[10vh] w-[6vw] bg-neutral-900 rounded-full hover:bg-teal-900 hover:scale-105 transition-all shadow-md shadow-teal-800 border border-white flex items-center justify-center cursor-pointer"
            onClick={() => handleSubjectChange(subject.id)}
          >
            {subject.subject_name}
          </li>
        ))}

        <div
          className="h-[10vh] w-[6vw] bg-neutral-900 rounded-full hover:bg-teal-900 hover:scale-105 transition-all border-1 shadow-md shadow-teal-800 border-white flex items-center justify-center cursor-pointer"
          onClick={() => handleSubjectChange("")}
        >
          <span className="text-6xl font-extrabold text-white flex relative top-[-1vh]">
            +
          </span>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
