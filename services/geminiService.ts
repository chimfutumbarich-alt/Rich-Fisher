
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePropertyDescription(title: string, type: string, features: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a sophisticated, high-end real estate description for a property with these details: 
      Title: ${title}, Type: ${type}, Key Features: ${features}. 
      Make it sound exclusive and luxurious for Wealth Estate clients. Keep it under 150 words.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "Luxurious property with excellent amenities.";
  } catch (error) {
    console.error("AI Description Error:", error);
    return "Failed to generate description. Please write manually.";
  }
}
