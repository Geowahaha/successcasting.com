import { supabase, AiContent } from './client';

export async function saveAiContent(content: Omit<AiContent, 'id' | 'created_at' | 'updated_at'>): Promise<AiContent | null> {
  const { data, error } = await supabase
    .from('ai_content')
    .insert([content])
    .select()
    .single();

  if (error) {
    console.error('Error saving content:', error);
    return null;
  }

  return data;
}

export async function getLatestContent(type: AiContent['type'], limit = 5): Promise<AiContent[]> {
  const { data, error } = await supabase
    .from('ai_content')
    .select('*')
    .eq('type', type)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching content:', error);
    return [];
  }

  return data || [];
}

export async function getContentById(id: string): Promise<AiContent | null> {
  const { data, error } = await supabase
    .from('ai_content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching content:', error);
    return null;
  }

  return data;
}

export async function publishContent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('ai_content')
    .update({ published: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error publishing content:', error);
    return false;
  }

  return true;
}

export async function unpublishContent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('ai_content')
    .update({ published: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error unpublishing content:', error);
    return false;
  }

  return true;
}

export async function getAllContent(type?: AiContent['type']): Promise<AiContent[]> {
  let query = supabase
    .from('ai_content')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all content:', error);
    return [];
  }

  return data || [];
}

export async function deleteContent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('ai_content')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting content:', error);
    return false;
  }

  return true;
}

export async function getContentStats(): Promise<{ blog: number; image: number; video: number; total: number }> {
  const { data, error } = await supabase
    .from('ai_content')
    .select('type');

  if (error) {
    console.error('Error fetching stats:', error);
    return { blog: 0, image: 0, video: 0, total: 0 };
  }

  const blog = data?.filter(d => d.type === 'blog-post').length || 0;
  const image = data?.filter(d => d.type === 'image-prompt').length || 0;
  const video = data?.filter(d => d.type === 'video-script').length || 0;

  return { blog, image, video, total: data?.length || 0 };
}
