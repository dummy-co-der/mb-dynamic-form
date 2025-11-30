import { useState, useEffect } from "react";
import { FormPage } from "./pages/form-page";
import { SubmissionsPage } from "./pages/submission-page";

export default function App() {
  const [page, setPage] = useState<"form" | "submissions">("form");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const tabClass = (active: boolean) =>
    `
      w-full sm:w-auto text-center px-4 py-2.5 rounded-lg text-sm font-medium
      transition-all duration-200 border shadow-sm
      ${active
      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
    }
    `;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl text-center font-extrabold tracking-tight">
            MatBook Assignment
          </h1>

          <button
            onClick={toggleTheme}
            className="
              px-3 py-2 rounded-full text-sm font-medium border
              bg-white 
              text-slate-700
              border-gray-300
              hover:bg-gray-100 
              transition cursor-pointer
            "
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <div
          className="
          flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 
          justify-center bg-white
          backdrop-blur-sm p-3 rounded-xl shadow transition
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
        <div>{page === "form" ? <FormPage /> : <SubmissionsPage onNavigateToForm={() => setPage("form")} />}</div>
      </div>
    </div>
  );
}
