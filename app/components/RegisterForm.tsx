"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");
    setSuccessMessage("");

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

    if (password !== confirmPassword) {
      setConfirmPasswordError(
        "Passwords do not match."
      );
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(
          data.error || "Unable to create account."
        );
        return;
      }

      setSuccessMessage(
        "Account created successfully! Redirecting to login..."
      );

      setUsername("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setServerError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* USERNAME */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-[var(--text)] mb-2"
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
          placeholder="Choose a username"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]"
        />

        {usernameError && (
          <p className="mt-1 text-sm text-red-500">
            {usernameError}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-[var(--text)] mb-2"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create a password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 pr-16 text-[var(--text)] outline-none focus:border-[var(--primary)]"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-3 text-sm font-semibold text-[var(--primary)]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {passwordError && (
          <p className="mt-1 text-sm text-red-500">
            {passwordError}
          </p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-[var(--text)] mb-2"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          placeholder="Confirm your password"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]"
        />

        {confirmPasswordError && (
          <p className="mt-1 text-sm text-red-500">
            {confirmPasswordError}
          </p>
        )}
      </div>

      {/* SERVER ERROR */}
      {serverError && (
        <div className="error-message">
          {serverError}
        </div>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* CREATE ACCOUNT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--primary)] py-3 font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Creating account..."
          : "Create account"}
      </button>

      {/* LOGIN LINK */}
      <div className="border-t border-[var(--border)] pt-4 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Already have an account?
        </p>

        <Link
          href="/login"
          className="mt-2 inline-block font-semibold text-[var(--primary)] hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}