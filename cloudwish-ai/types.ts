export enum Tone {
  FUNNY = 'Смешной',
  TOUCHING = 'Трогательный',
  FORMAL = 'Официальный',
  POETIC = 'Поэтичный',
  ROMANTIC = 'Романтичный',
  MOTIVATIONAL = 'Мотивационный',
  SARCASTIC = 'Саркастичный',
  EPIC = 'Эпичный',
  SHORT = 'Короткий',
  WISE = 'Мудрый'
}

export interface GreetingRequest {
  name: string;
  occasion: string;
  tone: Tone;
  details?: string;
}

export interface GreetingResponse {
  id: string;
  text: string;
  timestamp: string;
}

export interface HistoryItem extends GreetingResponse {
  occasion: string;
  name: string;
}

// Mimicking the DynamoDB structure for educational purposes
export interface DynamoDBRecord {
  PartitionKey: string; // RequestID
  SortKey: string;      // Timestamp
  Payload: string;      // The generated text
}