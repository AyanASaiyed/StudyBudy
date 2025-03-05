import { NextRequest, NextResponse } from "next/server";
import { verifyJWTToken } from "../../../lib/jwt";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJWTToken(token);
    console.log("Verified User: ", decoded);

    return NextResponse.json({
      content: `Hello ${decoded.email}, you have access to protected content`,
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}
