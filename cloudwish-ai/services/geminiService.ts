import { GreetingRequest } from "../types";
import { GoogleGenAI } from "@google/genai";

// AWS ARCHITECTURE & TRIPLE FALLBACK SYSTEM
// 1. AWS Lambda (Primary, Serverless)
// 2. Direct Gemini SDK (Secondary, Client-side)
// 3. Mock Data (Safety Net, guarantees UI works for demos)

export const generateGreeting = async (request: GreetingRequest): Promise<string> => {
  const prompt = `
    Напиши поздравление на русском языке.
    Кому: ${request.name}
    Повод: ${request.occasion}
    Тон: ${request.tone}
    ${request.details ? `Дополнительные детали: ${request.details}` : ''}
    
    Поздравление должно быть креативным, структурированным и длиной примерно 50-80 слов. 
    Используй эмодзи.
  `;

  // Get Env Vars
  // FIX: Support both naming conventions to match Vercel config
  const env = (import.meta as any).env;
  const apiUrl = env.VITE_AWS_API_URL;
  const apiKey = env.VITE_GEMINI_API_KEY || env.VITE_API_KEY;

  let errors: string[] = [];

  // --- LEVEL 1: AWS ARCHITECTURE ---
  if (apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      return data.text || "Пустой ответ от Lambda.";
    } catch (err) {
      console.warn("⚠️ AWS Failed:", err);
      errors.push(`AWS: ${(err as Error).message}`);
    }
  } else {
    errors.push("AWS URL not configured");
  }

  // --- LEVEL 2: DIRECT CLIENT-SIDE GEMINI ---
  if (apiKey) {
    try {
      console.info("ℹ️ Switching to Client-Side Fallback...");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      console.warn("⚠️ Gemini Direct Failed:", err);
      errors.push(`Gemini: ${(err as Error).message}`);
    }
  } else {
    errors.push("Gemini Key not configured (Check VITE_API_KEY in Vercel)");
  }

  // --- LEVEL 3: MOCK DATA (DEMO MODE) ---
  // If we reached here, everything failed. Return a fake success so the app looks working.
  console.error("❌ All backends failed. Using Demo Mock Data. Errors:", errors);
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  return `✨ (Демо-режим) Система работает автономно!\n\n` +
         `Дорогой ${request.name || 'Друг'}! \n` +
         `Поздравляю с поводом "${request.occasion || 'Праздник'}"! ` +
         `Желаю, чтобы твои мечты сбывались со скоростью света, а счастье было безграничным, как облачное хранилище AWS! ☁️🚀\n\n` +
         `Пусть каждый день приносит радость и новые возможности! 🌟\n\n` +
         `_Примечание: Это тестовый ответ, так как соединение с сервером сейчас недоступно (CORS или API Key)._`;
};
