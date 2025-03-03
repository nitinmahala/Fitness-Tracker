import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fitness Tracker",
  description: "Track your workouts and monitor your fitness progress"
    
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-background to-muted/30 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}



import './globals.css'