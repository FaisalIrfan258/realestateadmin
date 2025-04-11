"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { logoutAdmin } from "./api"

const AuthContext = createContext()

// Get base URL from environment variable
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || ""
  }
  return ""
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      console.log("Token from localStorage:", token)

      if (token) {
        // Logic to set user
      } else {
        // Logic to redirect to login
      }
    }
  }, [pathname, router])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Save token and user data
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data))

      setUser(data)
      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      // Call logout API
      await logoutAdmin()
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      // Clear local storage regardless of API success
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

