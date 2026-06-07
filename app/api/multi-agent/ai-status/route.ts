import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'No API key' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Say "OK" in one word' }],
        max_tokens: 10,
      }),
    });

    const data = await response.json();
    return NextResponse.json({
      success: true,
      status: 'connected',
      model: data.model,
      reply: data.choices?.[0]?.message?.content,
      usage: data.usage
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) });
  }
}
