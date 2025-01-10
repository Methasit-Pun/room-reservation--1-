'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { reserveRoom, getReservations } from '@/app/actions'
import { AvailabilityGraph } from '@/app/components/AvailabilityGraph'
import { useAuth } from '@/app/AuthProvider'

// Mock data for room details
const roomDetails = {
  1: { name: "AIS 5G GARAGE", capacity: 10, image: "https://www.eng.chula.ac.th/wp-content/uploads/2022/08/05-2-1024x683.jpg" },
  2: { name: "Room 601", capacity: 40, image: "https://www.eng.chula.ac.th/wp-content/uploads/2020/10/4-1024x769.jpg" },
  3: { name: "Room 602", capacity: 50, image: "https://www.eng.chula.ac.th/wp-content/uploads/2024/12/13-6-768x512.jpg" },
}

export default function RoomDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [name, setName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [slots, setSlots] = useState<{ start: string; end: string; isBooked: boolean }[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [lineUserId, setLineUserId] = useState<string | null>(null)

  const room = roomDetails[params.id as keyof typeof roomDetails]

  useEffect(() => {
    const storedLineUserId = localStorage.getItem('lineUserId')
    if (storedLineUserId) {
      setLineUserId(storedLineUserId)
    }
  }, [])

  useEffect(() => {
    if (date) {
      fetchReservations()
    }
  }, [date, params.id])

  useEffect(() => {
    if (!loading && !user && !lineUserId) {
      router.push('/login')
    }
  }, [loading, user, lineUserId, router])

  const fetchReservations = async () => {
    if (date) {
      const reservations = await getReservations(params.id, date.toISOString().split('T')[0])
      const newSlots = generateTimeSlots(reservations)
      setSlots(newSlots)
    }
  }

  const generateTimeSlots = (reservations: any[]) => {
    const slots = []
    for (let i = 0; i < 24; i++) {
      const start = `${i.toString().padStart(2, '0')}:00`
      const end = `${(i + 1).toString().padStart(2, '0')}:00`
      const isBooked = reservations.some(r => 
        (r.start_time <= start && r.end_time > start) || 
        (r.start_time >= start && r.start_time < end)
      )
      slots.push({ start, end, isBooked })
    }
    return slots
  }

  const isTimeSlotAvailable = (start: string, end: string) => {
    const startTime = new Date(`1970-01-01T${start}:00`).getTime()
    const endTime = new Date(`1970-01-01T${end}:00`).getTime()

    return slots.every(slot => {
      const slotStart = new Date(`1970-01-01T${slot.start}:00`).getTime()
      const slotEnd = new Date(`1970-01-01T${slot.end}:00`).getTime()

      if (slot.isBooked) {
        return endTime <= slotStart || startTime >= slotEnd
      }
      return true
    })
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showConfirm) {
      if (startTime >= endTime) {
        setErrorMessage('The start time must be earlier than the end time. Please correct the timings.')
        return
      }

      const start = new Date(`1970-01-01T${startTime}:00`)
      const end = new Date(`1970-01-01T${endTime}:00`)
      const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      if (durationInHours >= 5) {
        setErrorMessage('Reservations cannot exceed 5 hours. Please select a shorter time frame.')
        return
      }

      if (isTimeSlotAvailable(startTime, endTime)) {
        setShowConfirm(true)
        setErrorMessage('')
      } else {
        setErrorMessage('The selected time slot is booked. Please choose another.')
      }
      return
    }
    if (date && termsAccepted) {
      try {
        if (!user && !lineUserId) {
          throw new Error('You must be logged in or provide a LINE user ID to make a reservation.')
        }
        const result = await reserveRoom({
          roomId: params.id,
          date: date.toISOString().split('T')[0],
          startTime,
          endTime,
          name,
          lineUserId: lineUserId || undefined,
          userId: user?.id
        })
        if (result.success) {
          router.push(`/confirmation/${result.reservation.id}`)
        } else {
          console.error('Reservation error:', result.error)
          setErrorMessage(`An error occurred while making the reservation: ${result.error}`)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.')
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user && !lineUserId) {
    return null // The useEffect will redirect to login page
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden order-2 lg:order-1">
          <div className="relative h-64 lg:h-full bg-gray-200">
            <img 
              src={roomDetails[params.id as keyof typeof roomDetails].image} 
              alt={room.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
              <p className="text-lg">Capacity: {room.capacity} people</p>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden order-1 lg:order-2">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardTitle className="text-2xl font-bold">Reserve {room.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleReservation} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-lg font-medium text-gray-700">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    setStartTime('')
                    setEndTime('')
                    setShowConfirm(false)
                    setErrorMessage('')
                  }}
                  className="rounded-md border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              {date && slots.length > 0 && (
                <AvailabilityGraph 
                  slots={slots} 
                  date={date?.toLocaleDateString() || ''}
                  selectedStart={startTime}
                  selectedEnd={endTime}
                  className="mt-4"
                />
              )}
              {errorMessage && (
                <p className="text-red-500">{errorMessage}</p>
              )}
              {showConfirm && (
                <>
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Reservation Owner Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-700"
                    >
                      I hereby confirm my reservation and accept the terms and conditions.
                    </label>
                  </div>
                </>
              )}
              <Button 
                type="submit" 
                disabled={showConfirm && !termsAccepted}
                className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${showConfirm && !termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {showConfirm ? 'Confirm Reservation' : 'Reserve Room'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

