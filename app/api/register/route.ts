import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { getDatabase } from "@/lib/mongodb";

const usernamePattern =
  /^[A-Za-z0-9_]{3,20}$/;

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      username,
      password,
    } = body;

    if (
      !username ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Username and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanUsername =
      String(username).trim();

    const usernameLower =
      cleanUsername.toLowerCase();

    if (
      !usernamePattern.test(
        cleanUsername
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Username must be 3–20 characters and contain only letters, numbers, or underscores.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 6 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const db =
      await getDatabase();

    const users =
      db.collection("users");

    const existingUser =
      await users.findOne({
        usernameLower,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "This username is already taken.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    const result =
      await users.insertOne({
        username:
          cleanUsername,

        usernameLower,

        passwordHash,

        createdAt:
          new Date(),
      });

    return NextResponse.json(
      {
        message:
          "Account created successfully.",

        user: {
          id:
            result.insertedId.toString(),

          username:
            cleanUsername,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    if (
      error instanceof Error &&
      error.message
        .toLowerCase()
        .includes(
          "authentication failed"
        )
    ) {
      return NextResponse.json(
        {
          error:
            "Database authentication failed. The provided MongoDB credentials are not being accepted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while creating the account.",
      },
      {
        status: 500,
      }
    );
  }
}