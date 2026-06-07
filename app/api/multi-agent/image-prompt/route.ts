import { NextResponse } from 'next/server';

const IMAGE_SYSTEM_PROMPT = `You are an image prompt generator for Success Casting metal casting factory. Generate detailed prompts for AI image generators about metal casting.`;

const IMAGE_TOPICS: Record<string, string> = {
  casting_process: 'Generate an image prompt showing metal casting process.',
  finished_parts: 'Create a prompt for high quality finished metal casting parts.',
  factory_equipment: 'Generate a prompt for industrial foundry equipment.',
  quality_inspection: 'Create a prompt showing quality control inspection.'
};

async function callGroq(model: string, messages: Array<{ role: string; content: string }>, max_tokens: number) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not found');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, max_tokens }),
  });
  
  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = body.topic || 'casting_process';
    const model = body.model || 'llama-3.3-70b-versatile';
    const maxTokens = body.maxTokens || 1024;

    const prompt = IMAGE_TOPICS[topic] || IMAGE_TOPICS.casting_process;

    const response = await callGroq(model, [
      { role: 'system', content: IMAGE_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ], maxTokens);

    return NextResponse.json({
      success: true,
      prompt: response.choices?.[0]?.message?.content || 'No prompt generated',
      model: response.model,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
