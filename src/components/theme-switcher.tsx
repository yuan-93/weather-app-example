"use client";

import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      {isClient ? (
        <>
          {theme === "system" && (
            <SunMoonIcon className="sm:w-6 sm:h-6 h-4 w-4" />
          )}
          {theme === "dark" && <MoonIcon className="sm:w-6 sm:h-6 h-4 w-4" />}
          {theme === "light" && <SunIcon className="sm:w-6 sm:h-6 h-4 w-4" />}
        </>
      ) : (
        <SunMoonIcon className="sm:w-6 sm:h-6 h-4 w-4" />
      )}
    </button>
  );
}
