
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AssessmentData, AIAnalysisResult } from "../types";

/**
 * Helper to handle the "Requested entity was not found" error by prompting for re-auth.
 */
function handleAuthError(error: any) {
  if (error?.message?.includes("Requested entity was not found")) {
    window.location.hash = '#/reauthorize';
    return new Error("Authorization expired. Please re-select your professional API key.");
  }
  return error;
}

/**
 * Complex task: Full Visa Assessment with Grounding
 * Model: gemini-3-pro-preview
 */
export async function analyzeVisaEligibility(data: AssessmentData): Promise<AIAnalysisResult & { sources?: any[] }> {
  // Always create a fresh instance to ensure the latest API key from environment is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a senior US Immigration Attorney at the Sovereign Bureau specializing in ${data.visaType} visas. 
    Analyze the following applicant data and provide a detailed assessment for EB1X US.
    
    Applicant Name: ${data.name}
    Field: ${data.field}
    Visa Type: ${data.visaType}
    Evidence Provided: ${JSON.stringify(data.criteriaScores)}
    Resume/Context: ${data.resumeText}

    Evaluate against the official USCIS 10-criteria (EB1A) or 8-criteria (O1A) standards.
    Use Google Search to cross-reference their field achievements with current industry standards and recent 2024/2025 visa trends.
    Be rigorous but constructive. Provide scores, strengths, weaknesses, and a strategic roadmap.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: "Scale 0-100 of approval probability" },
            qualifiedCriteria: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of criteria titles that are currently strong"
            },
            weakCriteria: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of criteria titles that need improvement"
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable steps to strengthen the case"
            },
            strategicPlan: { type: Type.STRING, description: "A summary of the overall roadmap" }
          },
          required: ["overallScore", "qualifiedCriteria", "weakCriteria", "recommendations", "strategicPlan"]
        }
      }
    });

    const result = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return { ...result, sources };
  } catch (err) {
    throw handleAuthError(err);
  }
}

/**
 * Fast task: Low-latency Strategy Insights
 */
export async function getQuickInsight(query: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a top-tier US immigration consultant for EB1X US, provide a concise (max 2 sentences), high-impact strategy tip for the following query. Maintain a formal, sovereign tone: ${query}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });
    return response.text || "The Bureau is currently synthesizing your strategic insight.";
  } catch (err) {
    throw handleAuthError(err);
  }
}

/**
 * Chatbot task
 */
export function createChat() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are the 'Sovereign Concierge', an elite AI assistant for EB1X US. You assist distinguished users with inquiries about EB1A and O1 visas. Maintain an American 'Old Money' aesthetic: professional, formal, highly intelligent, and extremely polite. Do not use slang. Provide authoritative guidance on US immigration standards.",
    },
  });
}

/**
 * Image refinement task
 */
export async function editImage(base64Image: string, prompt: string, mimeType: string = 'image/jpeg'): Promise<string | undefined> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (err) {
    throw handleAuthError(err);
  }
}
