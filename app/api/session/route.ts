import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json(
        {
          loggedIn: false,
        },
        {
          status: 401,
        }
      );
    }

    if (!ObjectId.isValid(session.value)) {
      return NextResponse.json(
        {
          loggedIn: false,
        },
        {
          status: 401,
        }
      );
    }

    const db = await getDatabase();
    const users = db.collection("users");

    const user = await users.findOne({
      _id: new ObjectId(session.value),
    });

    if (!user) {
      return NextResponse.json(
        {
          loggedIn: false,
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);

    return NextResponse.json(
      {
        loggedIn: false,
        error: "Unable to check session.",
      },
      {
        status: 500,
      }
    );
  }
}