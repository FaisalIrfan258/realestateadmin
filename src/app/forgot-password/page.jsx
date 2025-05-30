"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from 'next/image'
import { forgotPassword } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [devToken, setDevToken] = useState(null)
  const [devResetUrl, setDevResetUrl] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setDevToken(null)
    setDevResetUrl(null)
    setIsLoading(true)

    try {
      const result = await forgotPassword(email)
      setSuccess(true)
      
      // Check if we're in development mode and have a token
      if (result.resetToken) {
        setDevToken(result.resetToken)
      }
      
      if (result.resetUrl) {
        setDevResetUrl(result.resetUrl)
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Image 
              src="/logo/nasirlogo.png" 
              alt="Real Estate Logo" 
              width={100}
              height={100}
              layout="intrinsic"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && !devToken && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                If an account exists with this email, we've sent password reset instructions.
              </AlertDescription>
            </Alert>
          )}
          
          {devToken && (
            <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
              <AlertDescription className="space-y-2">
                <p><strong>Development Mode:</strong> Email service not configured</p>
                <p className="text-xs break-all">Token: {devToken}</p>
                {devResetUrl && (
                  <p className="pt-1">
                    <Link 
                      href={devResetUrl} 
                      className="text-blue-600 hover:underline"
                    >
                      Click here to reset your password
                    </Link>
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Processing..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 