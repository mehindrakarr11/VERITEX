import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisMetric } from "../types";

// Initialize the client strictly according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResponse = async (
  question: string,
  answer: string,
  type: string
): Promise<AnalysisMetric> => {
  // Check for API key presence to provide fallback if needed
  if (!process.env.API_KEY) {
    console.warn("No API Key provided. Returning mock data.");
    return mockAnalysis();
  }

  try {
    const prompt = `
      You are an expert behavioral analyst. Analyze the following transcript from a video interview.
      
      Context:
      Question Type: ${type}
      Question: "${question}"
      User Answer: "${answer}"

      Analyze the text for:
      1. Confidence: Assertive language, clear structure, lack of hedging.
      2. Stress: Repetition, disjointed sentences, negative sentiment.
      3. Hesitation: Use of filler words (implied if transcript has them, or based on sentence fragments), indirect answers.

      Return a JSON object with:
      - confidence (0-100 integer)
      - stress (0-100 integer)
      - hesitation (0-100 integer)
      - reasoning (Max 1 sentence summary of why)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidence: { type: Type.INTEGER },
            stress: { type: Type.INTEGER },
            hesitation: { type: Type.INTEGER },
            reasoning: { type: Type.STRING },
          },
          required: ["confidence", "stress", "hesitation", "reasoning"],
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    return JSON.parse(jsonText) as AnalysisMetric;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return mockAnalysis();
  }
};

const mockAnalysis = (): AnalysisMetric => ({
  confidence: Math.floor(Math.random() * 30) + 60,
  stress: Math.floor(Math.random() * 40),
  hesitation: Math.floor(Math.random() * 30),
  reasoning: "Analysis simulated (API Key missing or Error). Pattern shows moderate consistency."
});