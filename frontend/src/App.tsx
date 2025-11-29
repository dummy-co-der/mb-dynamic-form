import { useState } from "react";
import { FormPage } from "./pages/form-page";
import { SubmissionsPage } from "./pages/submission-page";

export default function App() {
  const [page, setPage] = useState<"form" | "submissions">("form");

  const tabClass = (active: boolean) =>
    `
      w-full sm:w-auto text-center px-4 py-2.5 rounded-lg text-sm font-medium
      transition-all duration-200 border shadow-sm
      ${active
      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700 dark:hover:bg-slate-700"
    }
    `;

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-center font-extrabold text-slate-800 dark:text-white tracking-tight">
            MatBook Assignment
          </h1>
        </div>

        <div
          className="
          flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 
          justify-center bg-white/80 dark:bg-slate-800/60 
          backdrop-blur-sm p-3 rounded-xl shadow 
          dark:shadow-slate-900/40 transition
        "
        >
          <button
            className={"cursor-pointer" + tabClass(page === "form")}
            onClick={() => setPage("form")}
          >
            Form
          </button>

          <button
            className={"cursor-pointer" + tabClass(page === "submissions")}
            onClick={() => setPage("submissions")}
          >
            Submissions
          </button>
        </div>
        <div>{page === "form" ? <FormPage /> : <SubmissionsPage />}</div>
      </div>
    </div>
  );
}
