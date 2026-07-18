import { createClient } from '@supabase/supabase-js'
let client
export function getSupabaseClient() {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase server credentials are not configured')
  client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return client
}
