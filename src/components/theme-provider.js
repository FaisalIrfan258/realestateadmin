// "use client"

// import { createContext, useContext, useEffect, useState } from "react"

// const ThemeContext = createContext({
//   theme: "light",
//   setTheme: () => null,
// })

// export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme", ...props }) {
//   const [mounted, setMounted] = useState(false)
//   const [theme, setTheme] = useState(defaultTheme)

//   // Only run on client side
//   useEffect(() => {
//     setMounted(true)

//     // Get stored theme
//     const storedTheme = localStorage.getItem(storageKey)
//     if (storedTheme) {
//       setTheme(storedTheme)
//     }
//   }, [storageKey])

//   useEffect(() => {
//     if (!mounted) return

//     const root = window.document.documentElement
//     root.classList.remove("light", "dark")

//     if (theme === "system") {
//       const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
//       root.classList.add(systemTheme)
//       return
//     }

//     root.classList.add(theme)
//   }, [theme, mounted])

//   const value = {
//     theme,
//     setTheme: (newTheme) => {
//       setTheme(newTheme)
//       if (mounted) {
//         localStorage.setItem(storageKey, newTheme)
//       }
//     },
//   }

//   // Prevent hydration mismatch by not rendering anything until mounted
//   if (!mounted) {
//     return <>{children}</>
//   }

//   return (
//     <ThemeContext.Provider {...props} value={value}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext)
//   if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
//   return context
// }

