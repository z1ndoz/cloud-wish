import { GreetingRequest } from "../types";
import { GoogleGenAI } from "@google/genai";

// AWS ARCHITECTURE & HYBRID FALLBACK
// 1. Try to call AWS Lambda via API Gateway (Serverless Architecture)
// 2. If AWS fails (CORS, 500, Network), fallback to direct Client-Side generation
// This ensures the app is always "working" for the user/demo.

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

  // Get Env Vars (casting to any to avoid TS errors in this environment)
  const apiUrl = (import.meta as any).env.VITE_AWS_API_URL;
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  let awsError = null;

  // --- ATTEMPT 1: AWS ARCHITECTURE ---
  if (apiUrl) {
    try {
      // Note: If you see CORS errors in console, you need to enable CORS in AWS API Gateway console
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`AWS status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || "Пустой ответ от Lambda.";

    } catch (err) {
      console.warn("⚠️ AWS Lambda connection failed. Switching to Fallback mode...", err);
      awsError = err;
    }
  }

  // --- ATTEMPT 2: FALLBACK (DIRECT CLIENT-SIDE) ---
  // Uses the API Key directly if AWS failed or isn't configured.
  if (apiKey) {
    try {
      if (awsError) {
        console.info("ℹ️ Using Client-Side generation fallback.");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;

    } catch (directErr) {
      // If even the fallback fails, throw a combined error
      const msg = awsError 
        ? `AWS Error: ${(awsError as Error).message} | Direct Error: ${(directErr as Error).message}`
        : (directErr as Error).message;
      throw new Error(msg);
    }
  }

  // --- ERROR STATE ---
  if (awsError) {
    throw new Error(`Ошибка подключения к AWS: ${(awsError as Error).message}. Проверьте настройки CORS в AWS Console.`);
  }

  throw new Error(
    "Конфигурация не найдена! Укажите VITE_AWS_API_URL или VITE_GEMINI_API_KEY в .env"
  );
};
