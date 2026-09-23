"use client";

import {
  useEffect,
  useState,
} from "react";

type Theme =
  | "light"
  | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] =
    useState<Theme>("light");

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute(
        "data-theme"
      );

    if (
      currentTheme === "dark" ||
      currentTheme === "light"
    ) {
      setTheme(
        currentTheme
      );
    }
  }, []);

  function toggleTheme() {
    const newTheme: Theme =
      theme === "light"
        ? "dark"
        : "light";

    setTheme(
      newTheme
    );

    document.documentElement.setAttribute(
      "data-theme",
      newTheme
    );

    localStorage.setItem(
      "simpledice-theme",
      newTheme
    );
  }

  return (
    <button
      type="button"
      onClick={
        toggleTheme
      }
      aria-label="Change color theme"
      title="Change color theme"
      className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
    >
      {theme === "light"
        ? "🌙 Dark"
        : "☀️ Light"}
    </button>
  );
}