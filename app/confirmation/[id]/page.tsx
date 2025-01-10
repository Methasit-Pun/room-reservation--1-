'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getReservations, storeLineUserId } from '@/app/actions'
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

export default function Confirmation({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservation = async () => {
      const result = await getReservations(undefined, undefined, params.id)
      if (result && result.length > 0) {
        setReservation(result[0])
      }
      setLoading(false)
    }
    fetchReservation()
  }, [params.id])

  useEffect(() => {
    if (reservation) {
      const lineUserId = localStorage.getItem('lineUserId')
      if (lineUserId) {
        storeLineUserId(lineUserId)
      }

      const timer = setTimeout(() => {
        window.location.href = `https://line.me/R/ti/p/@258lblss?${new URLSearchParams({
          message: `Confirm reservation ${reservation.id}`
        }).toString()}`
      }, 10000) // Redirect after 10 seconds

      return () => clearTimeout(timer)
    }
  }, [reservation])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!reservation) {
    return <ReservationNotFound />
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold">Room Reservation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <Section title="Reservation Details">
            <InfoItem label="Room Name" value={reservation.room_id} />
            <InfoItem label="Date" value={new Date(reservation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoItem label="Time" value={`${reservation.start_time} - ${reservation.end_time}`} />
          </Section>

          <Section title="Guest Information">
            <InfoItem label="Name" value={reservation.name} />
          </Section>

          {DEBUG_MODE && reservation && (
            <Section title="Debug Information">
              <InfoItem label="LINE User ID" value={reservation.line_user_id || 'Not available'} />
            </Section>
          )}

          <p className="text-center text-gray-600">
            You will be redirected to Line OA in a few seconds to confirm your reservation. If not, please click the button below.
          </p>

          <div className="flex justify-center mt-8">
            <Link href={`https://line.me/R/ti/p/@258lblss?${new URLSearchParams({
              message: `Confirm reservation ${reservation.id}`
            }).toString()}`} passHref>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                Confirm in Line OA
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <p className="text-gray-700">
      <span className="font-medium">{label}:</span> {value}
    </p>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-blue-600">
          <Skeleton className="h-8 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function ReservationNotFound() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="bg-red-600 text-white">
          <CardTitle className="text-2xl font-bold">Reservation Not Found</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">We're sorry, but we couldn't find the reservation you're looking for.</p>
          <Link href="/" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

