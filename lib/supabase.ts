import { createClient } from '@supabase/supabase-js'
import { log, error } from './logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getAuthenticatedClient() {
  return supabase
}

export async function refreshSupabaseSchema() {
  try {
    await supabase.schema.reload()
    log('Supabase schema reloaded successfully')
    return true
  } catch (err) {
    error('Failed to reload Supabase schema', err)
    return false
  }
}

export async function testSupabaseConnection() {
  try {
    const { data, error: supabaseError } = await supabase.from('reservations').select('count', { count: 'exact' })
    if (supabaseError) throw supabaseError
    log('Supabase connection successful. Row count:', data)
    return true
  } catch (err) {
    error('Supabase connection failed', err)
    return false
  }
}

