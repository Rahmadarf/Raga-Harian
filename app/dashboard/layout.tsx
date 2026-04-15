import Sidebar from "@/component/user-dashboard"
import "../globals.css"
import { Plus_Jakarta_Sans, Rubik } from 'next/font/google'

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

            <body className="min-h-full flex flex-col">
                <Sidebar />
                {children}
            </body>
        </html>
    );
}
