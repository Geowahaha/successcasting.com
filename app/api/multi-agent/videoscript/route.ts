import { NextResponse } from 'next/server';

const VIDEO_SYSTEM_PROMPT = `You are a professional video script writer for Success Casting, a precision metal casting factory in Thailand. Generate engaging video scripts.`;

const TOPIC_SCRIPTS: Record<string, string> = {
  sand_casting: 'Generate a video script about Sand Casting process.',
  investment_casting: 'Create a video script about Investment Casting.',
  die_casting: 'Write a video script about Die Casting.',
  factory_tour: 'Create a factory tour script.'
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'No API key' }, { status: 500 });

    const body = await request.json();
    const topic = body.topic || 'sand_casting';
    const model = body.model || 'llama-3.3-70b-versatile';
    const prompt = TOPIC_SCRIPTS[topic] || TOPIC_SCRIPTS.sand_casting;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: VIDEO_SYSTEM_PROMPT }, { role: 'user', content: prompt }], max_tokens: 1024 }),
    });

    if (!response.ok) throw new Error(`Groq error: ${response.status}`);
    const data = await response.json();

    return NextResponse.json({ success: true, script: data.choices?.[0]?.message?.content, model: data.model });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
