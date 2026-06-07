import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wqhnngaygjeclqujtrkc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    let blog = null, image = null, video = null;
    let blogError = null, imageError = null, videoError = null;

    const blogResult = await supabase
      .from('ai_content')
      .select('*')
      .eq('type', 'blog-post')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (blogResult.data && blogResult.data.length > 0) {
      blog = blogResult.data[0];
    }
    blogError = blogResult.error;

    const imageResult = await supabase
      .from('ai_content')
      .select('*')
      .eq('type', 'image-prompt')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (imageResult.data && imageResult.data.length > 0) {
      image = imageResult.data[0];
    }
    imageError = imageResult.error;

    const videoResult = await supabase
      .from('ai_content')
      .select('*')
      .eq('type', 'video-script')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (videoResult.data && videoResult.data.length > 0) {
      video = videoResult.data[0];
    }
    videoError = videoResult.error;

    if (blogError || imageError || videoError) {
      console.error('Query errors:', { blogError, imageError, videoError });
    }

    return NextResponse.json({
      success: true,
      latest: {
        blogPost: blog,
        imagePrompt: image,
        videoScript: video
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
