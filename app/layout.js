import React from "react"
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700'] })

export const metadata = {
  title: 'Tennis Recruiting Hub',
  description: 'Personalised email outreach to every college tennis coach',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{background:'#020c1b', minHeight:'100vh'}}>{children}</body>
    </html>
  )
}
