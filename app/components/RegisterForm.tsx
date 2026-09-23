"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let valid = true;

    if (firstName.trim().length < 2) {
      setFirstNameError(
        "First name must contain at least 2 characters."
      );
      valid = false;
    }

    if (lastName.trim().length < 2) {
      setLastNameError(
        "Last name must contain at least 2 characters."
      );
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      valid = false;
    }

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

    console.log("Registration data:", {
      firstName,
      lastName,
      email,
      username,
      password,
    });

    alert(
      "Registration form is ready to connect to the database."
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* FIRST NAME + LAST NAME */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            First name
          </label>

          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            placeholder="First name"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          {firstNameError && (
            <p className="text-red-500 text-sm mt-1">
              {firstNameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Last name
          </label>

          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            placeholder="Last name"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          {lastNameError && (
            <p className="text-red-500 text-sm mt-1">
              {lastNameError}
            </p>
          )}
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter your email"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        {emailError && (
          <p className="text-red-500 text-sm mt-1">
            {emailError}
          </p>
        )}
      </div>

      {/* USERNAME */}
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
          placeholder="Choose a username"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        {usernameError && (
          <p className="text-red-500 text-sm mt-1">
            {usernameError}
          </p>
        )}
      </div>

      {/* PASSWORD */}
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create a password"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-16 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-3 text-sm text-blue-600 font-semibold"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {passwordError && (
          <p className="text-red-500 text-sm mt-1">
            {passwordError}
          </p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-slate-700 mb-2"
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
          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        {confirmPasswordError && (
          <p className="text-red-500 text-sm mt-1">
            {confirmPasswordError}
          </p>
        )}
      </div>

      {/* CREATE ACCOUNT BUTTON */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
      >
        Create account
      </button>

      {/* LOGIN LINK */}
      <div className="text-center pt-4 border-t border-slate-200">
        <p className="text-slate-500 text-sm">
          Already have an account?
        </p>

        <Link
          href="/login"
          className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}