'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      await resetPassword(email)
      setMessage('Password reset email sent. Please check your inbox.')
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <Button type="submit" className="w-full">
              Send Reset Email
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

