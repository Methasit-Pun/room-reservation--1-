import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Confirmation() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Reservation Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your room reservation has been confirmed. Thank you for using our service!</p>
          <Link href="/" passHref>
            <Button>Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

