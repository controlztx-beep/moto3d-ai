import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey)
  console.warn("WARNING: GOOGLE_AI_API_KEY is not set in environment variables");

const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_PROMPT = `You are MOTO3D AI, an expert motorcycle configuration assistant. You have deep knowledge of all motorcycle brands, models, parts, and accessories.

Your role:
- Help users configure their dream motorcycle
- Recommend parts based on riding style, budget, and preferences
- Explain technical specifications in simple, understandable language
- Provide compatibility information between parts
- Share maintenance tips and best practices
- Compare different options objectively
- Suggest performance improvements
- Advise on safety considerations

Rules:
- Be concise but informative (2-4 paragraphs max)
- Use bullet points for lists
- Include specific numbers and specs when relevant
- Be enthusiastic about motorcycles but honest about limitations
- If unsure about something, say so
- Format responses in markdown
- When recommending parts, explain WHY they are good choices
- Consider the user's current configuration context when answering`;

export async function chatWithAI(
  userMessage: string,
  context: string,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `${SYSTEM_PROMPT}\n\nCurrent Configuration Context:\n${context}\n\nUser Question: ${userMessage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to get AI response");
  }
}

export async function analyzePartWithAI(
  partName: string,
  partCategory: string,
  partSpecs: string,
  motorcycleName: string,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this motorcycle part in detail:\n\nMotorcycle: ${motorcycleName}\nPart: ${partName}\nCategory: ${partCategory}\nSpecifications: ${partSpecs}\n\nProvide:\n1. What this part does and why it matters (2-3 sentences)\n2. Performance impact (bullet points)\n3. Compatibility notes\n4. Maintenance tips (2-3 tips)\n5. Value assessment (is it worth the price?)\n\nKeep it concise and practical.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to analyze part");
  }
}

export async function getAIRecommendations(
  motorcycleName: string,
  currentParts: string,
  ridingStyle: string,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `${SYSTEM_PROMPT}\n\nMotorcycle: ${motorcycleName}\nCurrently equipped upgrades: ${currentParts || "None (all stock)"}\nRiding style: ${ridingStyle}\n\nRecommend the top 5 upgrades this rider should consider. For each:\n- Part name and type\n- Why it suits their riding style\n- Estimated price range\n- Priority level (must-have / nice-to-have / luxury)\n\nKeep recommendations practical and specific to this motorcycle.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to get recommendations");
  }
}

export async function analyzeConfiguration(
  motorcycleName: string,
  equippedParts: string,
  totalPrice: string,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this complete motorcycle configuration:\n\nBase Motorcycle: ${motorcycleName}\nEquipped Upgrades: ${equippedParts || "None (all stock)"}\nTotal Price: ${totalPrice}\n\nProvide a configuration analysis with:\n1. Overall Score out of 100\n2. Performance Rating: X/10\n3. Style Rating: X/10\n4. Comfort Rating: X/10\n5. Value Rating: X/10\n6. Strengths (3 bullet points)\n7. Potential improvements (3 bullet points)\n8. Any compatibility concerns\n9. One-sentence summary\n\nFormat with clear headers and be specific.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to analyze configuration");
  }
}
