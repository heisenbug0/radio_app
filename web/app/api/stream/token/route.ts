import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const client = new StreamClient(apiKey, apiSecret, { timeout: 3000 });
    const expire = Math.round(Date.now() / 1000) + 60 * 60;
    const tokenIssued = Math.floor(Date.now() / 1000) - 60;
    const token = client.createToken(userId, expire, tokenIssued);

    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}
