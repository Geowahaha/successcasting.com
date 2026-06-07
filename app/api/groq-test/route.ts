import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ 
      step: 'check-key',
      success: false, 
      error: 'GROQ_API_KEY not set' 
    });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
        max_tokens: 10
      })
    });

    const statusText = response.statusText;
    const ok = response.ok;
    
    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ 
        step: 'groq-call',
        success: false, 
        httpStatus: response.status,
        httpStatusText: statusText,
        error: 'Groq API error',
        details: error.substring(0, 500)
      });
    }

    const data = await response.json();
    return NextResponse.json({
      step: 'success',
      success: true,
      httpStatus: response.status,
      message: data.choices?.[0]?.message?.content || 'No response',
      model: data.model,
      usage: data.usage
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({
      step: 'catch',
      success: false,
      error: errorMessage,
      stack: errorStack?.substring(0, 500)
    });
  }
}
