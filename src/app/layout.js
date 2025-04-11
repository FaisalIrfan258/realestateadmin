import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Real Estate Admin Dashboard",
  description: "Admin dashboard for real estate agency",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
       
          <AuthProvider>{children}</AuthProvider>
        
      </body>
    </html>
  )
}

  