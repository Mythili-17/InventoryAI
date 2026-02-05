// Wraps the Gemini API call. 
// Builds a system instruction + inventory JSON, sends the user prompt, 
// and returns a response string.

import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Declare process for TypeScript to avoid "Cannot find name 'process'" errors
declare var process: {
  env: {
    API_KEY: string;
  };
};

export const getGeminiResponse = async (
  userMessage: string, 
  inventoryData: InventoryItem[],
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = []
) => {
  // Use the exact initialization required by the guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  if (!process.env.API_KEY || process.env.API_KEY === "") {
    return "Error: API Key is missing. Please ensure your .env.local file contains GEMINI_API_KEY and you have restarted your 'npm run dev' terminal.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    const fullSystemInstruction = `${SYSTEM_INSTRUCTION}
    
    CURRENT INVENTORY DATA (JSON):
    ${JSON.stringify(inventoryData)}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.1,
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error: any) {
    console.error("Gemini API Detailed Error:", error);
    
    const errorMsg = error.message || "";
    if (errorMsg.includes("403") || errorMsg.includes("API_KEY_INVALID")) {
      return "Error: The API key is invalid. Please double check the key in your .env.local file.";
    }
    
    return `Connection Error: ${errorMsg || "An unexpected error occurred."}`;
  }
};