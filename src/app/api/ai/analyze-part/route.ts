import { NextRequest, NextResponse } from "next/server";

import { analyzePartWithAI } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { partName, partCategory, partSpecs, motorcycleName } =
      await req.json();
    if (!partName) {
      return NextResponse.json({ error: "Part name required" }, { status: 400 });
    }
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }
    const analysis = await analyzePartWithAI(
      partName,
      partCategory ?? "",
      partSpecs ?? "",
      motorcycleName ?? "",
    );
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Part analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze part" },
      { status: 500 },
    );
  }
}
