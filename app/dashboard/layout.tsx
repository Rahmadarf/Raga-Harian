"use client"

import "../globals.css"
import { Plus_Jakarta_Sans, Rubik } from 'next/font/google'

import { DashboardProvider } from "@/context/DashboardProvider"

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-heading',
})

const rubik = Rubik({
    subsets: ['latin'],
    variable: '--font-body',
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html
            lang="en"
            className={`${jakarta.variable} ${rubik.variable} h-full antialiased`}
        >
            <body className="min-h-full flex-1 flex-col w-full overflow-y-auto bg-[#F8FAFC] p-0">
                <DashboardProvider>
                    {children}
                </DashboardProvider>
            </body>
        </html>
    );
}
