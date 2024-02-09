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
      className="px-4 rounded-2xl bg-[#6C40B5] text-white dark:bg-[#28124D]"
    >
      {theme === "dark" && <MoonIcon />}
      {theme === "light" && <SunIcon />}
      {theme === "system" && <SunMoonIcon />}
    </button>
  );
}
