import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import ThemeToggle from "./components/ThemeToggle";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dice Roller",
  description:
    "SimpleDice - roll dice, create an account, and save your history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          This script checks the saved theme before React loads.

          This prevents the page from briefly showing light mode
          before switching to dark mode.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("simpledice-theme");

                const systemPrefersDark = window.matchMedia(
                  "(prefers-color-scheme: dark)"
                ).matches;

                const theme =
                  savedTheme === "dark" || savedTheme === "light"
                    ? savedTheme
                    : systemPrefersDark
                      ? "dark"
                      : "light";

                document.documentElement.setAttribute(
                  "data-theme",
                  theme
                );
              } catch (error) {
                document.documentElement.setAttribute(
                  "data-theme",
                  "light"
                );
              }
            `,
          }}
        />
      </head>

      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {/* ============================= */}
        {/* HEADER / NAVIGATION */}
        {/* ============================= */}

        <header className="border-b border-[var(--border)] bg-[var(--navy)] text-white shadow-sm">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <span className="text-2xl">
                🎲
              </span>

              <span>
                Dice Roller
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium sm:gap-4">

              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                Dice Roller
              </Link>

              <Link
                href="/history"
                className="rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                History
              </Link>

              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>

              {/* Global dark/light mode toggle */}
              <ThemeToggle />

            </div>
          </nav>
        </header>

        {/* ============================= */}
        {/* PAGE CONTENT */}
        {/* ============================= */}

        <main className="mx-auto w-full max-w-6xl p-6">
          {children}
        </main>

      </body>
    </html>
  );
}