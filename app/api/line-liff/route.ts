import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lineUserId = searchParams.get('lineUserId')

  if (!lineUserId) {
    return NextResponse.json({ error: 'LINE user ID is required' }, { status: 400 })
  }

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID
  if (!liffId) {
    return NextResponse.json({ error: 'LIFF ID is not configured' }, { status: 500 })
  }

  // Redirect to the room selection page with the LINE user ID
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?lineUserId=${lineUserId}`)
}

