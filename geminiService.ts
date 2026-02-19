
import { GoogleGenAI, Type } from "@google/genai";
import { MaintenanceItem, AIAdvice } from "./types";

// Always initialize GoogleGenAI with the apiKey from process.env.API_KEY inside the function
// to ensure it uses the most current context/key selection and avoids stale instances.
export const getMaintenanceAdvice = async (
  totalOdometer: number,
  items: MaintenanceItem[]
): Promise<AIAdvice | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const maintenanceSummary = items.map(item => {
      const trip = typeof item.recommendedRange === 'number' 
        ? totalOdometer - item.lastServiceOdometer 
        : 'N/A';
      return `${item.component}: Trip=${trip}km, Limit=${item.recommendedRange}km`;
    }).join('\n');

    const prompt = `
      You are an expert motorcycle mechanic. Based on the following maintenance records for a motorcycle currently at ${totalOdometer}km total reading, provide a health assessment and advice.
      
      Maintenance Records:
      ${maintenanceSummary}

      Analyze which items are closest to their limits or overdue. Provide your analysis in a structured format.
    `;

    // Use gemini-3-flash-preview for general health assessment and reasoning tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A high-level summary of the bike's current status." },
            urgentTasks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of tasks that need immediate attention."
            },
            maintenanceTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Proactive tips for motorcycle longevity."
            }
          },
          required: ["summary", "urgentTasks", "maintenanceTips"]
        }
      }
    });

    // Access the .text property directly to retrieve the generated string
    const text = response.text;
    if (!text) return null;

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini AI error:", error);
    return null;
  }
};
