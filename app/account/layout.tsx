import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionId = (await cookies()).get("session")?.value;

  if (!sessionId || !ObjectId.isValid(sessionId)) {
    redirect("/login");
  }

  const db = await getDatabase();
  const user = await db.collection("users").findOne({
    _id: new ObjectId(sessionId),
  });

  if (!user) {
    redirect("/login");
  }

  return children;
}