"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { logoutAdmin } from "./api"
import Cookies from "js-cookie"

const AuthContext = createContext()

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
    const cookieUser = Cookies.get("user")
    const token = Cookies.get("token")

    if (token && cookieUser) {
      setUser(JSON.parse(cookieUser))
    } else {
      if (!pathname.startsWith("/login") && 
          !pathname.startsWith("/register") && 
          !pathname.startsWith("/forgot-password") && 
          !pathname.startsWith("/reset-password")) {
        router.push("/login")
      }
    }
    setLoading(false)
  }, [pathname])

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

      Cookies.set("token", data.token)
      const { token, ...userInfo } = data
      Cookies.set("user", JSON.stringify(userInfo))

      setUser(userInfo)
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
      await logoutAdmin()
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      Cookies.remove("token")
      Cookies.remove("user")
      setUser(null)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)