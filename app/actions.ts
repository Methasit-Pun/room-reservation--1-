'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { log, error } from '@/lib/logger'
import { Client } from '@line/bot-sdk'

const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
})

export async function reserveRoom(data: {
  roomId: string
  date: string
  startTime: string
  endTime: string
  name: string
  lineUserId?: string
  userId?: string
}) {
  log('Attempting to reserve room', data)
  try {
    if (!data.lineUserId && !data.userId) {
      throw new Error('Either LINE user ID or app user ID must be provided')
    }

    const { data: reservation, error: supabaseError } = await supabase
      .from('reservations')
      .insert({
        room_id: data.roomId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        name: data.name,
        line_user_id: data.lineUserId,
        user_id: data.userId,
        status: 'confirmed'
      })
      .select()
      .single()

    if (supabaseError) {
      error('Supabase error while reserving room', supabaseError)
      return { success: false, error: supabaseError.message }
    }

    if (!reservation) {
      error('No reservation data returned', null)
      return { success: false, error: 'No reservation data returned' }
    }

    if (reservation.line_user_id) {
      await sendLineConfirmation(reservation.line_user_id, reservation)
    }

    revalidatePath(`/room/${data.roomId}`)

    log('Room reserved successfully', reservation)
    return { success: true, reservation }
  } catch (unexpectedError) {
    error('Unexpected error while reserving room', unexpectedError)
    return { success: false, error: unexpectedError instanceof Error ? unexpectedError.message : 'An unexpected error occurred' }
  }
}

export async function getReservations(roomId?: string, date?: string, id?: string) {
  let query = supabase.from('reservations').select('*, line_user_id')

  if (id) {
    query = query.eq('id', id)
  } else if (roomId && date) {
    query = query.eq('room_id', roomId).eq('date', date)
  }

  const { data, error: supabaseError } = await query

  if (supabaseError) {
    error('Error fetching reservations', supabaseError)
    return []
  }

  return data
}

export async function getUserReservations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        rooms:room_id (name)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: true })

    if (error) {
      throw error
    }

    return data?.map(reservation => ({
      ...reservation,
      room_name: getRoomName(reservation.room_id, reservation.rooms?.name)
    })) || []
  } catch (err) {
    error('Error fetching user reservations', err)
    return []
  }
}

function getRoomName(roomId: string, roomName: string | null): string {
  const roomMapping: { [key: string]: string } = {
    '1': 'AIS Garage',
    '2': '601',
    '3': '602'
  }
  return roomName || roomMapping[roomId] || `Room ${roomId}`
}

async function sendLineConfirmation(lineUserId: string, reservation: any) {
  const message = {
    type: 'text',
    text: `Your reservation has been confirmed!\n\nReservation Details:\nRoom: ${reservation.room_id}\nDate: ${new Date(reservation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nTime: ${reservation.start_time} - ${reservation.end_time}\n\nThank you for using our service!`
  }

  try {
    await lineClient.pushMessage(lineUserId, message)
    log('Line confirmation message sent', { lineUserId, reservationId: reservation.id })
  } catch (err) {
    error('Error sending Line confirmation message', err)
  }
}

export async function storeLineUserId(lineUserId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({ line_user_id: lineUserId }, { onConflict: 'line_user_id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    log('LINE user ID stored successfully', { lineUserId })
    return { success: true, userId: data.id }
  } catch (unexpectedError) {
    error('Error storing LINE user ID', unexpectedError)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

