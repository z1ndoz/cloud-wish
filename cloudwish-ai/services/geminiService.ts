import { GoogleGenAI } from "@google/genai";
import { GreetingRequest } from "../types";

// NOTE: In the real AWS deployment, this logic moves to the AWS Lambda function.
// For this frontend demo, we call Gemini directly so the UI works immediately.

export const generateGreeting = async (request: GreetingRequest): Promise<string> => {
  // Use process.env.API_KEY as required by the SDK guidelines.
  // Assume process.env.API_KEY is pre-configured and valid.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Напиши поздравление на русском языке.
    Кому: ${request.name}
    Повод: ${request.occasion}
    Тон: ${request.tone}
    ${request.details ? `Дополнительные детали: ${request.details}` : ''}
    
    Поздравление должно быть креативным, структурированным и длиной примерно 50-80 слов. 
    Используй эмодзи.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Не удалось сгенерировать текст. Попробуйте снова.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Ошибка при обращении к AI.");
  }
};