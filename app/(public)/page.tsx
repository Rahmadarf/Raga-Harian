"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity, Droplets, Brain, MessageCircle, BarChart2, Shield,
  ChevronRight, Star, ArrowRight, Heart, Zap, Globe,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const features = [
  { icon: Activity, title: "Monitoring Aktivitas", desc: "Pantau langkah harian, kalori terbakar, dan detak jantung secara real-time dengan grafik interaktif.", color: "#00A8A8" },
  { icon: Droplets, title: "Tracker Hidrasi", desc: "Ingatkan dirimu untuk minum air cukup setiap hari. Visualisasi hidrasi per jam yang intuitif.", color: "#3B82F6" },
  { icon: Brain, title: "BMI & Nutrisi", desc: "Hitung BMI otomatis, pantau asupan makronutrien, dan dapatkan saran makan yang personal.", color: "#8B5CF6" },
  { icon: MessageCircle, title: "Chat Dokter Langsung", desc: "Konsultasi dengan tenaga medis bersertifikat kapan saja. Resep digital langsung di dalam chat.", color: "#10B981" },
  { icon: BarChart2, title: "Riwayat Kesehatan", desc: "Rekam jejak pemeriksaan, tren berat badan, dan catatan dokter tersimpan rapi dalam satu tempat.", color: "#F97316" },
  { icon: Shield, title: "Data Aman & Terenkripsi", desc: "Privasi kamu adalah prioritas kami. Semua data kesehatan dilindungi enkripsi tingkat militer.", color: "#EF4444" },
];

const stats = [
  { value: "50K+", label: "Pengguna Aktif" },
  { value: "200+", label: "Dokter Tersertifikasi" },
  { value: "98%", label: "Kepuasan Pengguna" },
  { value: "4.9★", label: "Rating App Store" },
];

const testimonials = [
  { name: "Andi Wijaya", role: "Software Engineer, 28 th", text: "HealthPulse benar-benar mengubah gaya hidup saya. Dalam 3 bulan BMI saya turun dari 27 ke 23, dan saya selalu tahu apa yang harus dimakan.", avatar: "AW", color: "#00A8A8" },
  { name: "Dewi Kusuma", role: "Ibu Rumah Tangga, 35 th", text: "Chat dengan dokter langsung dari HP tanpa antri panjang. Fitur resep digital-nya sangat membantu, tidak perlu takut lupa beli obat.", avatar: "DK", color: "#3B82F6" },
  { name: "Budi Santoso", role: "Wirausaha, 45 th", text: "Saya punya riwayat hipertensi. Dengan HealthPulse dokter saya bisa pantau tekanan darah saya setiap hari. Ini benar-benar life saver.", avatar: "BS", color: "#8B5CF6" },
];

const plans = [
  { name: "Gratis", price: "Rp 0", period: "/bulan", desc: "Untuk memulai perjalanan kesehatan", features: ["Monitoring aktivitas dasar", "Tracker hidrasi & kalori", "Riwayat 30 hari", "1 konsultasi dokter/bulan"], cta: "Mulai Gratis", highlight: false },
  { name: "Pro", price: "Rp 49.000", period: "/bulan", desc: "Untuk pengguna serius", features: ["Semua fitur Gratis", "Konsultasi dokter unlimited", "Riwayat tidak terbatas", "Resep digital", "Analisis nutrisi lanjutan", "Notifikasi & pengingat pintar"], cta: "Coba 14 Hari Gratis", highlight: true },
  { name: "Keluarga", price: "Rp 89.000", period: "/bulan", desc: "Untuk seluruh keluarga (5 akun)", features: ["Semua fitur Pro", "5 profil anggota keluarga", "Dashboard keluarga terpusat", "Prioritas akses dokter"], cta: "Pilih Keluarga", highlight: false },
];

export default function Home() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans">

      {/* ── NAVBAR ── */}
      {/* <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EEF2F7]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
            <span className="font-heading font-bold text-[20px] text-[#00A8A8]">HealthPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-[#64748B]">
            <a href="#features" className="hover:text-[#00A8A8] transition-colors">Fitur</a>
            <a href="#stats" className="hover:text-[#00A8A8] transition-colors">Statistik</a>
            <a href="#testimonials" className="hover:text-[#00A8A8] transition-colors">Testimoni</a>
            <a href="#pricing" className="hover:text-[#00A8A8] transition-colors">Harga</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-[13px] text-[#64748B] hover:text-[#00A8A8] font-medium transition-colors">Masuk</Link>
            <Link href="/auth/register" className="hp-btn-primary text-[13px] py-2 px-4">Daftar Gratis</Link>
          </div>
        </div>
      </nav> */}

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 bg-[rgba(0,168,168,0.1)] text-[#00A8A8] text-[12px] font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap size={12} /> Platform Kesehatan #1 di Indonesia
          </span>
        </motion.div>
        <motion.h1 {...fadeUp(0.1)} className="font-heading font-bold text-[52px] leading-[1.15] text-[#1E293B] mb-5 max-w-3xl mx-auto">
          Kendalikan Kesehatan Kamu{" "}
          <span className="text-[#00A8A8]">Setiap Hari</span>
        </motion.h1>
        <motion.p {...fadeUp(0.2)} className="text-[17px] text-[#64748B] max-w-xl mx-auto leading-relaxed mb-10">
          Satu dashboard untuk monitoring kesehatan lengkap — cuaca, BMI, hidrasi, nutrisi, aktivitas, dan konsultasi dokter langsung dari genggaman tanganmu.
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/register" className="hp-btn-primary text-[15px] py-3 px-7">
            Mulai Gratis Sekarang <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="hp-btn-outline text-[15px] py-3 px-7">
            Lihat Demo <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="bg-linear-to-b from-primary/10 to-transparent rounded-[32px] p-6 border border-[#00A8A8]/10">
            {/* Mini dashboard preview */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="col-span-2 bg-linear-to-br from-[#00A8A8] to-[#008E8E] rounded-[20px] p-5 text-white text-left relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                <p className="text-[11px] text-white/60 uppercase tracking-widest mb-2">Status Kesehatan</p>
                <p className="font-heading font-bold text-[28px]">Kondisi Ideal ✓</p>
                <p className="text-[13px] text-white/75 mt-1">Semua 4 indikator dalam batas normal</p>
                <div className="flex gap-3 mt-4">
                  {[["22.4", "BMI"], ["1.8L", "Hidrasi"], ["7.2k", "Langkah"]].map(([v, l]) => (
                    <div key={l} className="bg-white/15 rounded-[10px] px-3 py-2">
                      <div className="font-heading font-bold text-[16px]">{v}</div>
                      <div className="text-[10px] text-white/70">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-3">Cuaca</p>
                <div className="text-[36px]">⛅</div>
                <p className="font-heading font-bold text-[28px] text-[#1E293B] leading-none">27°C</p>
                <p className="text-[12px] text-[#64748B] mt-1">Karanganyar</p>
                <div className="mt-3 bg-[#FFF7ED] rounded-[8px] px-2 py-1.5 text-[10px] text-[#F97316]">⚠ UV Tinggi</div>
              </div>
              <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">Hidrasi</p>
                <p className="font-heading font-bold text-[24px] text-[#3B82F6]">1.8 L</p>
                <p className="text-[11px] text-[#94A3B8]">dari 2.5 L</p>
                <div className="mt-2 h-1.5 bg-[#DBEAFE] rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-[#3B82F6] rounded-full" />
                </div>
              </div>
              <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">BMI</p>
                <p className="font-heading font-bold text-[24px] text-[#00A8A8]">22.4</p>
                <span className="text-[11px] font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-full">Normal</span>
              </div>
              <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">Konsultasi</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#00A8A8] flex items-center justify-center text-white text-[8px] font-bold">DR</div>
                  <p className="text-[12px] font-medium text-[#1E293B]">Dr. Reza</p>
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full ml-auto" />
                </div>
                <p className="text-[11px] text-[#64748B]">Online · 2 mnt</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="bg-[#2D3E50] py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center">
              <p className="font-heading font-bold text-[38px] text-[#00A8A8]">{s.value}</p>
              <p className="text-[13px] text-[#94A3B8] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[rgba(0,168,168,0.1)] text-[#00A8A8] text-[12px] font-medium px-4 py-1.5 rounded-full mb-4">
            <Globe size={12} /> Semua dalam Satu Platform
          </span>
          <h2 className="font-heading font-bold text-[38px] text-[#1E293B] mb-3">Fitur Lengkap untuk Hidup Sehat</h2>
          <p className="text-[16px] text-[#64748B] max-w-lg mx-auto">Dari monitoring harian hingga konsultasi dokter — semua bisa kamu lakukan dari satu aplikasi.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} {...fadeUp(i * 0.08)}
                whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
                className="hp-card cursor-pointer transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                  <Icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="font-heading font-bold text-[15px] text-[#1E293B] mb-2">{f.title}</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-heading font-bold text-[38px] text-[#1E293B] mb-3">Mulai dalam 3 Langkah</h2>
            <p className="text-[16px] text-[#64748B]">Sederhana, cepat, dan langsung terasa manfaatnya.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Daftar Gratis", desc: "Buat akun dalam 60 detik. Tidak perlu kartu kredit, langsung bisa digunakan.", icon: "🚀" },
              { step: "02", title: "Isi Profil Kesehatan", desc: "Masukkan data dasar seperti berat, tinggi, dan target kesehatan kamu.", icon: "📋" },
              { step: "03", title: "Mulai Monitoring", desc: "Dashboard langsung aktif. Pantau kesehatan dan hubungi dokter kapan saja.", icon: "💚" },
            ].map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.15)} className="text-center">
                <div className="w-16 h-16 rounded-[20px] bg-[rgba(0,168,168,0.08)] flex items-center justify-center text-[32px] mx-auto mb-5">{s.icon}</div>
                <div className="font-heading font-bold text-[12px] text-[#00A8A8] tracking-widest mb-2">{s.step}</div>
                <h3 className="font-heading font-bold text-[18px] text-[#1E293B] mb-2">{s.title}</h3>
                <p className="text-[14px] text-[#64748B] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="font-heading font-bold text-[38px] text-[#1E293B] mb-3">Yang Mereka Rasakan</h2>
          <p className="text-[16px] text-[#64748B]">Ribuan pengguna telah merasakan manfaat HealthPulse.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(i * 0.1)} className="hp-card">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-[#F97316] text-[#F97316]" />)}
              </div>
              <p className="text-[14px] text-[#475569] leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-white text-[12px]" style={{ background: t.color }}>{t.avatar}</div>
                <div>
                  <p className="font-medium text-[13px] text-[#1E293B]">{t.name}</p>
                  <p className="text-[11px] text-[#64748B]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-[#2D3E50] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-heading font-bold text-[38px] text-white mb-3">Harga Transparan</h2>
            <p className="text-[16px] text-[#94A3B8]">Pilih paket yang sesuai kebutuhan dan mulai perjalanan sehat kamu.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((p, i) => (
              <motion.div key={p.name} {...fadeUp(i * 0.1)}
                className={`rounded-[24px] p-6 ${p.highlight ? "bg-[#00A8A8] text-white" : "bg-white"}`}
              >
                {p.highlight && <div className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-medium px-3 py-1 rounded-full mb-4">⭐ Paling Populer</div>}
                <p className={`text-[13px] font-medium mb-1 ${p.highlight ? "text-white/70" : "text-[#64748B]"}`}>{p.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-heading font-bold text-[30px]">{p.price}</span>
                  <span className={`text-[13px] ${p.highlight ? "text-white/60" : "text-[#64748B]"}`}>{p.period}</span>
                </div>
                <p className={`text-[13px] mb-5 ${p.highlight ? "text-white/75" : "text-[#64748B]"}`}>{p.desc}</p>
                <div className="flex flex-col gap-2.5 mb-6">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-[13px]">
                      <span className={p.highlight ? "text-white" : "text-[#10B981]"}>✓</span>
                      <span className={p.highlight ? "text-white/90" : "text-[#475569]"}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/register"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-[12px] font-medium text-[13px] transition-all ${p.highlight ? "bg-white text-[#00A8A8] hover:bg-white/90" : "bg-[#00A8A8] text-white hover:bg-[#008E8E]"
                    }`}
                >
                  {p.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.div {...fadeUp()}>
          <Heart size={40} className="text-[#00A8A8] mx-auto mb-6" />
          <h2 className="font-heading font-bold text-[38px] text-[#1E293B] mb-4">Mulai Hidup Sehat Hari Ini</h2>
          <p className="text-[16px] text-[#64748B] mb-8 leading-relaxed">Bergabunglah dengan 50.000+ pengguna yang sudah merasakan manfaat monitoring kesehatan harian bersama HealthPulse.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/register" className="hp-btn-primary text-[15px] py-3 px-8">Daftar Sekarang — Gratis <ArrowRight size={16} /></Link>
            <Link href="/auth/login" className="text-[14px] text-[#64748B] hover:text-[#00A8A8] transition-colors">Sudah punya akun? Masuk →</Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#EEF2F7] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
            <span className="font-heading font-bold text-[16px] text-[#00A8A8]">HealthPulse</span>
          </div>
          <p className="text-[12px] text-[#94A3B8]">© 2026 HealthPulse. Semua hak dilindungi.</p>
          <div className="flex gap-5 text-[12px] text-[#64748B]">
            <a href="#" className="hover:text-[#00A8A8]">Privasi</a>
            <a href="#" className="hover:text-[#00A8A8]">Syarat</a>
            <a href="#" className="hover:text-[#00A8A8]">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}