import "@/app/globals.css"
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-heading',
})

const dmSans = DM_Sans({
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
            className={`${jakarta.variable} ${dmSans.variable} h-full antialiased`}
        >

            <body className="min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}
