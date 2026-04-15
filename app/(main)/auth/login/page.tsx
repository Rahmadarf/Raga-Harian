"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"user" | "doctor">("user");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        router.push(role === "doctor" ? "/doctor" : "/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Left panel */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-gradient-to-br from-[#00A8A8] to-[#008E8E] p-12 relative overflow-hidden"
            >
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/[0.07]" />
                <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/[0.05]" />
                <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-white/[0.04]" />

                <div>
                    <Link href="/landing" className="flex items-center gap-2 mb-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        <span className="font-heading font-bold text-[22px] text-white">HealthPulse</span>
                    </Link>
                    <h2 className="font-heading font-bold text-[36px] text-white leading-snug mb-4">
                        Selamat Datang Kembali!
                    </h2>
                    <p className="text-[15px] text-white/75 leading-relaxed">
                        Pantau kesehatan harian kamu, konsultasikan dengan dokter, dan raih target sehat bersama HealthPulse.
                    </p>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-4">
                    {[["7.240", "Langkah Hari Ini"], ["22.4", "BMI Kamu"], ["1.8L", "Hidrasi"], ["98%", "Skor Tidur"]].map(([v, l]) => (
                        <div key={l} className="bg-white/15 rounded-[16px] p-4">
                            <p className="font-heading font-bold text-[22px] text-white">{v}</p>
                            <p className="text-[12px] text-white/70">{l}</p>
                        </div>
                    ))}
                </div>

                <p className="text-[12px] text-white/50">© 2026 HealthPulse. Semua hak dilindungi.</p>
            </motion.div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="w-full max-w-[420px]"
                >
                    {/* Mobile logo */}
                    <Link href="/landing" className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
                        <span className="font-heading font-bold text-[20px] text-[#00A8A8]">HealthPulse</span>
                    </Link>

                    <h1 className="font-heading font-bold text-[28px] text-[#1E293B] mb-1">Masuk ke Akun</h1>
                    <p className="text-[14px] text-[#64748B] mb-7">Belum punya akun?{" "}
                        <Link href="/auth/register" className="text-[#00A8A8] font-medium hover:underline">Daftar gratis</Link>
                    </p>

                    {/* Role toggle */}
                    <div className="flex bg-[#F1F5F9] rounded-[14px] p-1 mb-7">
                        {(["user", "doctor"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-medium transition-all ${role === r ? "bg-white text-[#1E293B] shadow-sm" : "text-[#64748B]"
                                    }`}
                            >
                                {r === "user" ? <Activity size={14} /> : <span className="text-[14px]">🩺</span>}
                                {r === "user" ? "Pasien / User" : "Dokter"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-[13px] font-medium text-[#1E293B] mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input
                                    type="email" required placeholder="email@kamu.com"
                                    className="hp-input pl-10"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[13px] font-medium text-[#1E293B]">Password</label>
                                <a href="#" className="text-[12px] text-[#00A8A8] hover:underline">Lupa password?</a>
                            </div>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input
                                    type={showPass ? "text" : "password"} required placeholder="Masukkan password"
                                    className="hp-input pl-10 pr-10"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-[#00A8A8]"
                                checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                            <span className="text-[13px] text-[#64748B]">Ingat saya selama 30 hari</span>
                        </label>

                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="hp-btn-primary w-full justify-center py-3 text-[14px] mt-1 disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Memverifikasi...</span>
                            ) : (
                                <span className="flex items-center gap-2">Masuk Sekarang <ArrowRight size={15} /></span>
                            )}
                        </motion.button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0]" /></div>
                        <div className="relative flex justify-center"><span className="bg-[#F8FAFC] px-3 text-[12px] text-[#94A3B8]">atau masuk dengan</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[["Google", "🇬"], ["Apple", "🍎"]].map(([name, icon]) => (
                            <button key={name} className="flex items-center justify-center gap-2 border border-[#E2E8F0] rounded-[12px] py-2.5 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                                <span>{icon}</span>{name}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}