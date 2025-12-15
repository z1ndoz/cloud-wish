import { GreetingRequest } from "../types";

// AWS ARCHITECTURE IMPLEMENTATION
// Now the frontend calls AWS API Gateway -> Lambda -> Gemini
// This secures the API Key on the backend (Lambda).

export const generateGreeting = async (request: GreetingRequest): Promise<string> => {
  // 1. Construct the prompt on the client side
  const prompt = `
    Напиши поздравление на русском языке.
    Кому: ${request.name}
    Повод: ${request.occasion}
    Тон: ${request.tone}
    ${request.details ? `Дополнительные детали: ${request.details}` : ''}
    
    Поздравление должно быть креативным, структурированным и длиной примерно 50-80 слов. 
    Используй эмодзи.
  `;

  // 2. Get the AWS API Gateway URL from environment variables
  // Using type assertion to bypass missing type definition for import.meta.env
  const apiUrl = (import.meta as any).env.VITE_AWS_API_URL;

  if (!apiUrl) {
    // Fallback error if user hasn't set up AWS yet
    throw new Error(
      "AWS API URL не найден! Пожалуйста, добавьте переменную VITE_AWS_API_URL в файл .env или настройки Vercel."
    );
  }

  try {
    // 3. Send request to AWS API Gateway
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error(`AWS Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Не удалось получить ответ от Lambda.";

  } catch (error) {
    console.error("AWS Lambda Connection Error:", error);
    throw error;
  }
};