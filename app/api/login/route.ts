import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { getDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          error: "Username and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanUsername = String(username).trim();
    const usernameLower = cleanUsername.toLowerCase();

    const db = await getDatabase();
    const users = db.collection("users");

    const user = await users.findOne({
      usernameLower,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid username or password.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(
      String(password),
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Invalid username or password.",
        },
        {
          status: 401,
        }
      );
    }

    // Login succeeded.
    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          username: user.username,
        },
      },
      {
        status: 200,
      }
    );

    // Store a session cookie so the server can tell
    // whether the user is logged in.
    response.cookies.set("session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred while logging in.",
      },
      {
        status: 500,
      }
    );
  }
}