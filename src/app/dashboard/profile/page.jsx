"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { changePassword } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function ProfilePage() {
  const { user, register } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerError, setRegisterError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Simulate API call for profile update
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })

      setSuccess(true)
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      })
    } catch (err) {
      setError("Failed to change password. Please check your current password and try again.")
      toast.error("Error", {
        description: "Failed to change password. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError(null)
    setRegisterSuccess(false)

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match")
      setRegisterLoading(false)
      return
    }

    try {
      const result = await register(registerData.name, registerData.email, registerData.password)
      if (result.success) {
        setRegisterSuccess(true)
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        toast.success("Admin registered", {
          description: "New admin user has been registered successfully.",
        })
      } else {
        setRegisterError(result.error)
        toast.error("Error", {
          description: "Failed to register new admin. Please try again.",
        })
      }
    } catch (err) {
      setRegisterError("An unexpected error occurred. Please try again.")
      toast.error("Error", {
        description: "Failed to register new admin. Please try again.",
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <DashboardLayout>
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>
            </CardContent>
          </form>
        </Card>

        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="mt-6 w-full">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-sm">{user?._id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Role</span>
                <span>Administrator</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Register New Admin Card - Only for existing admins */}
        <Card className="md:col-span-3 mt-6">
          <CardHeader>
            <CardTitle>Register New Admin</CardTitle>
            <CardDescription>Create a new administrator account</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegisterSubmit}>
            <CardContent className="space-y-4">
              {registerError && (
                <Alert variant="destructive">
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              {registerSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>New admin registered successfully!</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registerName">Full Name</Label>
                  <Input
                    id="registerName"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input
                    id="registerPassword"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerConfirmPassword">Confirm Password</Label>
                  <Input
                    id="registerConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={registerLoading}>
                {registerLoading ? "Registering..." : "Register New Admin"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

