import Link from "next/link"

export default function Navbar() {

    const navLinks = [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "About",
            href: "/about",
        },
        {
            title: "Contact",
            href: "/contact",
        },
        {
            title: "Help",
            href: "/help",
        }
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EEF2F7]">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
                    <span className="font-heading font-bold text-[20px] text-[#00A8A8]">HealthPulse</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-[13px] text-text-secondary">
                    <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
                    <a href="#stats" className="hover:text-primary transition-colors">Statistik</a>
                    <a href="#testimonials" className="hover:text-primary transition-colors">Testimoni</a>
                    <a href="#pricing" className="hover:text-primary transition-colors">Harga</a>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="text-[13px] text-text-secondary hover:text-primary font-medium transition-colors">Masuk</Link>
                    <Link href="/auth/register" className="hp-btn-primary text-[13px] py-2 px-4">Daftar Gratis</Link>
                </div>
            </div>
        </nav>
    )
}