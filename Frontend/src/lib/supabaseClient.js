import { createClient } from '@supabase/supabase-js'

// SvelteKit의 '$env/static/public' 대신 Vite의 'import.meta.env'를 사용합니다.
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)