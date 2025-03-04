import { NextResponse } from "next/server";
import { verifyJWTToken } from "../../../lib/jwt";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token || !verifyJWTToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Welcome Authorized User" });
}
