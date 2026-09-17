"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUsernameError("");
    setPasswordError("");

    let valid = true;

    if (username.trim().length < 3) {
      setUsernameError(
        "Username must contain at least 3 characters."
      );
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError(
        "Password must contain at least 6 characters."
      );
      valid = false;
    }

    if (!valid) {
      return;
    }

    console.log("Login data:", {
      username,
      password,
    });

    alert("Login form is ready to connect to the database.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
          placeholder="Enter your username"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        {usernameError && (
          <p className="text-red-500 text-sm mt-1">
            {usernameError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-16 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-3 top-3 text-sm text-blue-600 font-semibold"
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        {passwordError && (
          <p className="text-red-500 text-sm mt-1">
            {passwordError}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">

        <label className="flex items-center gap-2 text-slate-600">

          <input
            type="checkbox"
          />

          Remember me
        </label>

        <button
          type="button"
          className="text-blue-600 hover:underline"
        >
          Forgot password?
        </button>

      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
      >
        Log in
      </button>

      <div className="text-center pt-4 border-t border-slate-200">

        <p className="text-slate-500 text-sm">
          Don't have an account?
        </p>

        <Link
          href="/register"
          className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
        >
          Create account
        </Link>

      </div>

    </form>
  );
}