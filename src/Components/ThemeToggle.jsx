import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggle = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  return (
    <label className="flex items-center bg-gray-100 rounded-xl gap-2 cursor-pointer ml-10">
      <input
        type="checkbox"
        className="toggle theme-controller"
        checked={theme === "dark"}
        onChange={handleToggle}
      />
    </label>
  );
};

export default ThemeToggle;
