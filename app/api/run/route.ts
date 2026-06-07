import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.Groq_API_Key || process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wqhnngaygjeclqujtrkc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const TOPICS = {
  'blog-post': ['sand_casting', 'investment_casting', 'die_casting', 'quality_control'],
  'image-prompt': ['casting_process', 'finished_parts', 'factory_equipment', 'quality_inspection'],
  'video-script': ['sand_casting', 'investment_casting', 'die_casting', 'factory_tour']
};

const PROMPTS = {
  'blog-post': 'You are a professional content writer for Success Casting, a precision metal casting factory in Thailand (since 1988). Write a comprehensive blog post about {topic}. Format with markdown headings.',
  'image-prompt': 'Generate a detailed, cinematic AI image prompt about {topic} for a metal casting factory. Include lighting, composition, and style details.',
  'video-script': 'Write an engaging video script about {topic} for Success Casting metal casting factory. Include scenes and narration.'
};

async function callGroq(model: string, systemPrompt: string, userPrompt: string, maxTokens = 2048) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq error ${response.status}: ${error}`);
  }

  return response.json();
}

async function saveToSupabase(type: string, topic: string, content: string, model: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_content`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      type,
      topic,
      content,
      model,
      published: true
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }

  return response.json();
}

function getRandomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'suphan-ai-auto-run-2026') {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized - check secret key'
    }, { status: 401 });
  }

  return POST(request);
}

export async function POST(request: Request) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'GROQ_API_KEY not configured'
      }, { status: 500 });
    }

    const timestamp = new Date().toISOString();
    const results: { agent: string; success: boolean; topic?: string; error?: string }[] = [];

    for (const [agentType, topics] of Object.entries(TOPICS)) {
      const topic = getRandomItem(topics);
      const systemPrompt = PROMPTS[agentType as keyof typeof PROMPTS].replace('{topic}', topic.replace(/_/g, ' '));

      try {
        console.log(`Running ${agentType} for topic: ${topic}`);
        const groqResponse = await callGroq('llama-3.3-70b-versatile', systemPrompt, 'Generate content.', 2048);

        if (!groqResponse.choices || !groqResponse.choices[0]) {
          throw new Error('No response from Groq');
        }

        const content = groqResponse.choices[0].message.content;

        await saveToSupabase(agentType, topic, content, 'llama-3.3-70b-versatile');

        results.push({
          agent: agentType,
          success: true,
          topic
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          agent: agentType,
          success: false,
          topic,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      timestamp,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount
      },
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
