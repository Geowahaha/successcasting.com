const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqRequest {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  max_tokens?: number;
  temperature?: number;
}

export interface GroqResponse {
  id: string;
  model: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callGroq(req: GroqRequest): Promise<GroqResponse> {
  const apiKey = process.env.GROQ_API_KEY || (process.env as Record<string, string | undefined>).Groq_api_key;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model || 'llama-3.1-70b-versatile',
      messages: req.messages,
      max_tokens: req.max_tokens || 1024,
      temperature: req.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  return response.json();
}

const GROQ_URL = GROQ_API_URL;

export function getGroqModel(): string {
  return process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
}
