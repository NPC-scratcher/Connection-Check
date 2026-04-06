import { GoogleGenAI, Type } from "@google/genai";
import { Translation } from "../lib/translations";

const apiKey = process.env.GEMINI_API_KEY;

export async function translateUI(targetLanguage: string, baseTranslation: Translation): Promise<Translation> {
  if (!apiKey) {
    console.warn("No Gemini API key found for auto-translation.");
    return baseTranslation;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Translate the following UI strings from Spanish to ${targetLanguage}. 
  Maintain the exact same keys. Return only the JSON object.
  Base strings: ${JSON.stringify(baseTranslation)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: Object.keys(baseTranslation).reduce((acc, key) => {
            acc[key] = { type: Type.STRING };
            return acc;
          }, {} as any),
          required: Object.keys(baseTranslation),
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error) {
    console.error("Error translating UI:", error);
  }

  return baseTranslation;
}
