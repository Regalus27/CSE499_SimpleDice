import type { Metadata } from "next";
import Link from "next/link";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const cookiePairs = document.cookie
                  .split("; ")
                  .filter(Boolean);

                const cookies = {};

                for (const cookie of cookiePairs) {
                  const separatorIndex =
                    cookie.indexOf("=");

                  if (separatorIndex === -1) {
                    continue;
                  }

                  const key =
                    cookie.slice(
                      0,
                      separatorIndex
                    );

                  const value =
                    cookie.slice(
                      separatorIndex + 1
                    );

                  cookies[key] = value;
                }

                const savedTheme =
                  cookies["simpledice-theme"];

                const systemPrefersDark =
                  window.matchMedia(
                    "(prefers-color-scheme: dark)"
                  ).matches;

                let theme = "light";

                if (
                  savedTheme === "light" ||
                  savedTheme === "dark"
                ) {
                  theme = savedTheme;
                } else if (
                  systemPrefersDark
                ) {
                  theme = "dark";
                }

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
        <header className="border-b border-[var(--border)] bg-[var(--navy)] text-white shadow-sm">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
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

              <ThemeToggle />
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl p-6">
          {children}
        </main>
      </body>
    </html>
  );
}