import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisMetric } from "../types";

// Initialize client using process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResponse = async (
  question: string,
  answer: string,
  type: string
): Promise<AnalysisMetric> => {
  try {
    const systemInstruction = `
You are VERITEX, an expert behavioral analyst for professional interviews.
Your goal is to evaluate the candidate's communication delivery, psychological comfort, and clarity.
Simulate the analysis style of a top-tier HR professional (Indian MNC standard).

Boundaries:
- Do NOT assess factual correctness of the answer.
- Do NOT use words like "lie", "deception", or "truth".
- Focus strictly on confidence, stress, hesitation, and clarity.
- Be polite, constructive, and neutral.
    `;

    const prompt = `
Context:
Question Type: ${type}
Question: "${question}"
Candidate Answer: "${answer}"

Analyze the text for:
1. Confidence: Assertiveness, lack of hedging.
2. Stress: Repetition, negative sentiment indicators.
3. Hesitation: Filler words, indirectness.
4. Clarity: Structure and coherence of the response.

Return a strictly valid JSON object.
    `;

    // Using gemini-3-flash-preview as per guidelines for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidence: { type: Type.INTEGER, description: "0-100 score" },
            stress: { type: Type.INTEGER, description: "0-100 score" },
            hesitation: { type: Type.INTEGER, description: "0-100 score" },
            clarity: { type: Type.INTEGER, description: "0-100 score" },
            summary: { type: Type.STRING, description: "Short neutral behavioral summary" },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["confidence", "stress", "hesitation", "clarity", "summary", "strengths", "improvements"],
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
  clarity: Math.floor(Math.random() * 20) + 70,
  summary: "Simulation mode: Response shows moderate structure but lacks specific details. (API Error)",
  strengths: ["Clear voice", "Good pace"],
  improvements: ["Reduce filler words", "Provide concrete examples"]
});