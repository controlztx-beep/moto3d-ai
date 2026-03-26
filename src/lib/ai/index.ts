/**
 * AI integration — Gemini helpers live in `./gemini` (server-only).
 * Client code should call `/api/ai/*` routes instead of importing `gemini` directly.
 */

export { buildConfiguratorContext } from "./build-config-context";
export { renderMarkdown } from "./markdown";

export async function placeholderAiResponse(prompt: string): Promise<string> {
  return `Echo: ${prompt}`;
}
