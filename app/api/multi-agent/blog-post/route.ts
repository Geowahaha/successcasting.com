import { NextResponse } from 'next/server';

const BLOG_SYSTEM_PROMPT = `You are a professional content writer for Success Casting, a precision metal casting factory in Thailand (since 1988).
Write SEO-optimized blog posts about metal casting topics.`;

const BLOG_TOPICS: Record<string, string> = {
  sand_casting: 'Write a guide about Sand Casting process, techniques, and applications.',
  investment_casting: 'Create a blog post about Investment Casting for aerospace and automotive parts.',
  die_casting: 'Write about Die Casting applications and materials.',
  quality_control: 'Create content about quality control in metal casting.'
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
    const topic = body.topic || 'sand_casting';
    const model = body.model || 'llama-3.3-70b-versatile';
    const maxTokens = body.maxTokens || 2048;

    const prompt = BLOG_TOPICS[topic] || BLOG_TOPICS.sand_casting;

    const response = await callGroq(model, [
      { role: 'system', content: BLOG_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ], maxTokens);

    return NextResponse.json({
      success: true,
      content: response.choices?.[0]?.message?.content || 'No content generated',
      model: response.model,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
