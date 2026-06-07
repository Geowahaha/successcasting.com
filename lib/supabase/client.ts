import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wqhnngaygjeclqujtrkc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaG5uZ2F5Z2plY2xxdWp0cmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODkwMDAsImV4cCI6MjA2MDc2NTAwMH0.demo_anon_key_replace_with_real';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AiContent {
  id?: string;
  type: 'blog-post' | 'image-prompt' | 'video-script';
  topic: string;
  content: string;
  model?: string;
  metadata?: Record<string, unknown>;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WebsiteConfig {
  id?: string;
  key: string;
  value?: string;
  updated_at?: string;
}
