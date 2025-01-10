import { NextResponse } from 'next/server'
import { Client, WebhookEvent } from '@line/bot-sdk'
import { supabase } from '@/lib/supabase'
import { log, error } from '@/lib/logger'
import { storeLineUserId } from '@/app/actions'

// Check for required environment variables
const requiredEnvVars = [
  'LINE_CHANNEL_SECRET',
  'LINE_CHANNEL_ACCESS_TOKEN',
  'NEXT_PUBLIC_LIFF_ID',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
  }
}

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!
}

const client = new Client(config)

export async function POST(req: Request) {
  const body = await req.json()

  try {
    await Promise.all(body.events.map(handleEvent))
    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    error('Error handling Line webhook event', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

async function handleEvent(event: WebhookEvent) {
  console.log('Received event:', JSON.stringify(event, null, 2))
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null
  }

  const { replyToken } = event
  const { text } = event.message
  const userId = event.source.userId

  console.log('Received text:', text)
  console.log('LINE User ID:', userId)

  log('Received message', { text, userId })

  if (text.toLowerCase() === 'i want to reserve a room right now') {
    try {
      await storeLineUserId(userId)
      const liffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}?lineUserId=${userId}`
      return client.replyMessage(replyToken, [
        {
          type: 'text',
          text: `Thank you! Please click the link below to reserve a room:`
        },
        {
          type: 'text',
          text: liffUrl
        }
      ])
    } catch (err) {
      error('Error processing reservation request', err)
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'Sorry, there was an error processing your request. Please try again later.'
      })
    }
  }

  if (text.toLowerCase().startsWith('confirm reservation')) {
    const reservationId = text.split(' ')[2]
    try {
      const reservation = await getReservation(reservationId)
      if (!reservation) {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: `Sorry, we couldn't find a reservation with ID ${reservationId}. Please check the ID and try again.`
        })
      }

      if (reservation.status === 'confirmed') {
        return client.replyMessage(replyToken, {
          type: 'text',
          text: `Reservation ${reservationId} is already confirmed. Here are the details:\n\nRoom: ${reservation.room_id}\nDate: ${new Date(reservation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nTime: ${reservation.start_time} - ${reservation.end_time}`
        })
      }

      await updateReservation(reservationId, userId)
      const updatedReservation = await getReservation(reservationId)
      
      return client.replyMessage(replyToken, {
        type: 'text',
        text: `Reservation ${reservationId} has been confirmed. Thank you!\n\nReservation Details:\nRoom: ${updatedReservation.room_id}\nDate: ${new Date(updatedReservation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nTime: ${updatedReservation.start_time} - ${updatedReservation.end_time}`
      })
    } catch (err) {
      error('Error confirming reservation', err)
      return client.replyMessage(replyToken, {
        type: 'text',
        text: 'Sorry, there was an error confirming your reservation. Please try again later.'
      })
    }
  }

  // Default response
  return client.replyMessage(replyToken, {
    type: 'text',
    text: `I received your message: "${text}". How can I assist you with your reservation?`
  })
}

async function getReservation(reservationId: string) {
  const { data, error: supabaseError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId)
    .single()

  if (supabaseError) {
    error('Error fetching reservation from database', supabaseError)
    throw supabaseError
  }

  return data
}

async function updateReservation(reservationId: string, lineUserId: string) {
  const { data, error: supabaseError } = await supabase
    .from('reservations')
    .update({ line_user_id: lineUserId, status: 'confirmed' })
    .eq('id', reservationId)
    .select()

  if (supabaseError) {
    error('Error updating reservation in database', supabaseError)
    throw supabaseError
  }

  log('Reservation confirmed', { reservationId, lineUserId })
  return data
}

