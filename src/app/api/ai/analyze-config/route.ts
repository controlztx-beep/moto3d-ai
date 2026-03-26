import { NextRequest, NextResponse } from "next/server";

import { analyzeConfiguration } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { motorcycleName, equippedParts, totalPrice } = await req.json();
    if (!motorcycleName) {
      return NextResponse.json(
        { error: "Motorcycle name required" },
        { status: 400 },
      );
    }
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }
    const analysis = await analyzeConfiguration(
      motorcycleName,
      equippedParts ?? "",
      totalPrice ?? "",
    );
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Config analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze configuration" },
      { status: 500 },
    );
  }
}
