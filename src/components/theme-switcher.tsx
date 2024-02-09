"use client";

import * as React from "react";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const onClick = () => {
    switch (theme) {
      case "dark":
        setTheme("light");
        break;
      case "light":
        setTheme("system");
        break;
      case "system":
        setTheme("dark");
        break;
    }
  };

  return (
    <button
      onClick={onClick}
      className="px-3 sm:px-4 rounded-2xl bg-[#6C40B5] text-white dark:bg-[#28124D]"
    >
      {theme === "system" ? (
        <SunMoonIcon className="sm:w-6 sm:h-6 h-4 w-4" />
      ) : theme === "dark" ? (
        <MoonIcon className="sm:w-6 sm:h-6 h-4 w-4" />
      ) : (
        <SunIcon className="sm:w-6 sm:h-6 h-4 w-4" />
      )}
    </button>
  );
}
