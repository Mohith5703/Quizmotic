/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export const generateQuizQuestions = async (topic: string, count: number = 5) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} multiple choice questions about "${topic}". Return them in the specified JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
              category: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "explanation", "difficulty", "category"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

export const getLearningContent = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the topic "${topic}" in a way that's perfect for a student. Include key facts and a summary.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting learning content:", error);
    return "Failed to fetch content from AI.";
  }
};
