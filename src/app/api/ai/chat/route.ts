import { NextRequest, NextResponse } from "next/server";

import { chatWithAI } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }
    const response = await chatWithAI(message, context || "");
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
