// Quick test script — run with: node test-gemini.mjs
import { GoogleGenAI } from "@google/genai";

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("Set GEMINI_API_KEY env var"); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log("Testing models...\n");
for (const model of MODELS) {
  try {
    const result = await Promise.race([
      ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: "Reply with just: OK" }] }],
        config: { temperature: 0 },
      }),
      new Promise((_, r) => setTimeout(() => r(new Error("TIMEOUT")), 12000)),
    ]);
    console.log(`✅ ${model}: ${result.text?.trim()}`);
  } catch (err) {
    console.log(`❌ ${model}: ${err.message?.slice(0, 100)}`);
  }
}
