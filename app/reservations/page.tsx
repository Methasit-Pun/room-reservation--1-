'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserReservations } from '@/app/actions'
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Reservation {
  id: string
  room_id: string
  room_name: string
  date: string
  start_time: string
  end_time: string
  name: string
  status: string
}

export default function ReservationsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        fetchReservations()
      }
    }
  }, [user, loading, router])

  const fetchReservations = async () => {
    if (user) {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        const userReservations = await getUserReservations(supabaseUser.id)
        setReservations(userReservations)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>
  }

  if (!user) {
    return null // The useEffect will redirect to login page
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Reservations</h1>
      {reservations.length === 0 ? (
        <p className="text-center text-gray-600">You don't have any reservations yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                <CardTitle className="text-xl font-semibold flex justify-between items-center">
                  <span>{reservation.room_name}</span>
                  <span className="text-sm font-normal px-2 py-1 bg-white text-purple-600 rounded-full">
                    {reservation.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Date:</span> {formatDate(reservation.date)}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Time:</span> {reservation.start_time} - {reservation.end_time}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Reserved by:</span> {reservation.name}
                  </p>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={() => router.push(`/confirmation/${reservation.id}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

