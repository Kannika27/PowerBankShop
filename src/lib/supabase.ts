import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hitragnhqzhpqvklimkc.supabase.co';
const supabaseAnonKey = 'sb_publishable_RB4o5CnAFXirs8lpdSeR9g_bFt5AD6X';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);