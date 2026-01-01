
import { GoogleGenAI } from "@google/genai";

export const generateIntegrationPlan = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not configured.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are an expert enterprise software architect. Provide a high-level technical integration plan for: "${prompt}". 
            
            Structure the response as follows:
            1. Integration Overview
            2. Recommended Tech Stack
            3. Key Demo Bank API Endpoints Required (use REST style e.g., GET /accounts)
            4. Potential Challenges & Mitigation
            5. Recommended Integration Category
            
            Keep it professional, concise and architecturally sound.`,
            config: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 1024,
            }
        });

        return response.text || "No response generated from AI.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate integration plan using AI.");
    }
};
