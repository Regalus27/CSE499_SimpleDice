import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "Dice rolling app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <header className="border-b border-[var(--border)] bg-[var(--navy)] text-white shadow-sm">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            {/* Logo and Link to home page */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-2xl">🎲</span>
              <span>Dice Roller</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium">
              {/* Navigation links */}
              <Link href="/" className="rounded px-3 py-2 text-white/90 hover:bg-white/5 hover:text-white">
                Dice Roller
              </Link>
              <Link href="/history" className="rounded px-3 py-2 text-white/90 hover:bg-white/5 hover:text-white">
                History
              </Link>
              <Link href="/login" className="rounded px-3 py-2 text-white/90 hover:bg-white/5 hover:text-white">
                Login
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}