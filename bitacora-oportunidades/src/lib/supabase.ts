import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 ALL ENVIRONMENT VARIABLES:', import.meta.env)
console.log('🔍 VITE VARIABLES:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')))
console.log('🔍 SUPABASE_URL raw:', import.meta.env.VITE_SUPABASE_URL)
console.log('🔍 SUPABASE_KEY raw:', import.meta.env.VITE_SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables check:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'SET' : 'MISSING',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'MISSING',
    allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
    rawUrl: import.meta.env.VITE_SUPABASE_URL,
    rawKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  })
  throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl ? 'SET' : 'MISSING'}, KEY: ${supabaseAnonKey ? 'SET' : 'MISSING'}`)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)