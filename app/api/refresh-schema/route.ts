import { NextResponse } from 'next/server'
import { refreshSupabaseSchema } from '@/lib/supabase'
import { log, error } from '@/lib/logger'

export async function GET() {
  const success = await refreshSupabaseSchema()
  if (success) {
    log('Schema refreshed successfully')
    return NextResponse.json({ message: 'Schema refreshed successfully' })
  } else {
    error('Failed to refresh schema', null)
    return NextResponse.json({ message: 'Failed to refresh schema' }, { status: 500 })
  }
}

