import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wqhnngaygjeclqujtrkc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, topic, content, model, metadata } = body;

    if (!type || !content) {
      return NextResponse.json({ success: false, error: 'Missing type or content' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_content')
      .insert([{
        type,
        topic: topic || 'general',
        content,
        model: model || 'llama-3.3-70b-versatile',
        metadata,
        published: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message: `${type} saved to Supabase`,
      createdAt: data.created_at
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST to save content to Supabase',
    supabaseUrl
  });
}
