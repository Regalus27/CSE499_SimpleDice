"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage("Please enter a username and password.");
      return;
    }

    // Registration API will be connected in a future sprint.
    setMessage("Registration form submitted successfully.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[var(--border)] rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--navy)]">
            Create Account
          </h1>

          <p className="mt-2 text-gray-600">
            Create an account to save your dice rolls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 font-medium text-[var(--text)]"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-[var(--text)]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-semibold text-white hover:opacity-90 cursor-pointer"
          >
            Register
          </button>

          {message && (
            <p className="text-center text-sm text-[var(--text)]">
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}