import { NextRequest, NextResponse } from "next/server";

import { getAIRecommendations } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { motorcycleName, currentParts, ridingStyle } = await req.json();
    if (!motorcycleName) {
      return NextResponse.json(
        { error: "Motorcycle name required" },
        { status: 400 },
      );
    }
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }
    const recommendations = await getAIRecommendations(
      motorcycleName,
      currentParts ?? "",
      ridingStyle ?? "",
    );
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 },
    );
  }
}
