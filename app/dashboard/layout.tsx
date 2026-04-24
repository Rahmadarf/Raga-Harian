"use client"

import Sidebar from "@/component/sidebar/user-dashboard"
import "../globals.css"
import TopBar from "@/component/top-banner"
import { Plus_Jakarta_Sans, Rubik } from 'next/font/google'
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

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

            <body className="min-h-full flex-1 flex-col p-6 pl-60 w-full overflow-y-auto bg-[#F8FAFC]">
                <Sidebar />
                {children}
            </body>
        </html>
    );
}
