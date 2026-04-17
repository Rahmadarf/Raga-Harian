import React from 'react';
import {
    LayoutGrid,
    Activity,
    History,
    Droplets,
    Calendar,
    MessageSquare,
    Bell,
    Send,
    Info,
    CloudSun,
    Hand,
    Smile,
} from 'lucide-react';

const HealthDashboard: React.FC = () => {
    const navItems = [
        { icon: LayoutGrid, label: 'Dashboard', active: true },
        { icon: Activity, label: 'Aktivitas', active: false },
        { icon: History, label: 'Riwayat', active: false },
        { icon: Droplets, label: 'Nutrisi', active: false },
        { icon: Calendar, label: 'Jadwal', active: false },
        { icon: MessageSquare, label: 'Konsultasi', active: false },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Rubik', sans-serif" }}>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-hidden overflow-y-auto">
                {/* Topbar */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div
                            className="flex items-center gap-2 text-[22px] font-bold text-[#1E293B]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Selamat pagi, Dimas <Hand className="w-6 h-6 text-[#F59E0B]" />
                        </div>
                        <div className="text-[13px] text-[#64748B] mt-0.5">
                            Senin, 14 April 2026 · Kondisi kamu hari ini terlihat bagus!
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-[38px] h-[38px] rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center relative cursor-pointer"
                        >
                            <Bell className="w-4 h-4 text-[#64748B]" />
                            <div
                                className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-white"
                                style={{ background: '#F97316' }}
                            />
                        </div>
                        <div
                            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            DK
                        </div>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {/* Health Status Card */}
                    <div
                        className="md:col-span-2 rounded-3xl p-5 border border-[#EEF2F7] relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #00A8A8 0%, #008E8E 100%)',
                            color: 'white',
                        }}
                    >
                        <div
                            className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] rounded-full"
                            style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                        />
                        <div
                            className="absolute -bottom-[40px] right-[60px] w-[90px] h-[90px] rounded-full"
                            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                        />

                        <div
                            className="text-[11px] font-medium uppercase tracking-wider mb-2.5"
                            style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.8px' }}
                        >
                            Status Kesehatan Hari Ini
                        </div>

                        <div
                            className="inline-flex items-center gap-1.5 rounded-[20px] px-3.5 py-1.5 text-[13px] font-medium text-white mb-4"
                            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A7F3D0]" />
                            Semua indikator normal
                        </div>

                        <div
                            className="text-[32px] font-bold text-white mb-1"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Kondisi Ideal
                        </div>

                        <div className="text-[13px] text-white/75">
                            Berdasarkan 4 parameter: BMI, hidrasi, aktivitas & lingkungan
                        </div>

                        <div className="grid grid-cols-2 lg:flex gap-4 mt-3.5">
                            {[
                                { val: '22.4', lbl: 'BMI Skor' },
                                { val: '1.8 L', lbl: 'Hidrasi' },
                                { val: '7,240', lbl: 'Langkah' },
                                { val: '98%', lbl: 'Skor Tidur' },
                            ].map((m, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl px-3.5 py-2"
                                    style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                                >
                                    <div
                                        className="text-lg font-bold text-white"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {m.val}
                                    </div>
                                    <div className="text-[11px] text-white/70">{m.lbl}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Doctor Chat Card - spans rows */}
                    <div
                        className="lg:col-start-3 lg:row-start-1 lg:row-span-4 flex flex-col rounded-3xl p-5 border border-[#EEF2F7] bg-white h-[500px] lg:h-auto"
                    >
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Konsultasi Dokter
                        </div>

                        <div
                            className="flex items-center gap-2.5 p-3 rounded-[14px] mb-3.5"
                            style={{ background: '#F8FAFC' }}
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0"
                                style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                DR
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-sm text-[#1E293B]">Dr. Reza Pratama</div>
                                <div className="text-[11px] text-[#64748B]">Sp. Gizi Klinik · RSU Bunda</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-[#10B981] ml-auto" />
                        </div>

                        <div className="flex-1 flex flex-col gap-2.5 mb-3 overflow-y-auto">
                            <div>
                                <div
                                    className="max-w-[85%] px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed self-start"
                                    style={{
                                        background: '#F1F5F9',
                                        color: '#1E293B',
                                        borderBottomLeftRadius: '4px',
                                    }}
                                >
                                    Selamat pagi Dimas! Berdasarkan data terakhirmu, BMI masih di rentang normal. Tetap jaga pola makan ya <Smile className="inline w-4 h-4 text-[#F59E0B] ml-1" />
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-0.5 ml-1">08:14</div>
                            </div>

                            <div className="self-end flex flex-col items-end">
                                <div
                                    className="max-w-[85%] px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed self-end"
                                    style={{
                                        background: '#00A8A8',
                                        color: 'white',
                                        borderBottomRightRadius: '4px',
                                    }}
                                >
                                    Dokter, saya agak pusing dari tadi pagi, kira-kira karena kurang minum ya?
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-0.5">08:22</div>
                            </div>

                            <div>
                                <div
                                    className="max-w-[85%] px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed self-start"
                                    style={{
                                        background: '#F1F5F9',
                                        color: '#1E293B',
                                        borderBottomLeftRadius: '4px',
                                    }}
                                >
                                    Bisa jadi. Data hidrasimu hari ini baru 1.8L dari target 2.5L. Coba minum 2 gelas sekarang dan istirahat sejenak.
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-0.5 ml-1">08:24</div>
                            </div>

                            <div className="self-end flex flex-col items-end">
                                <div
                                    className="max-w-[85%] px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed self-end"
                                    style={{
                                        background: '#00A8A8',
                                        color: 'white',
                                        borderBottomRightRadius: '4px',
                                    }}
                                >
                                    Baik dok, terima kasih!
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-0.5">08:25</div>
                            </div>

                            <div className="flex justify-center my-1">
                                <span
                                    className="text-[10px] text-[#94A3B8] px-2.5 py-0.5 rounded-[20px]"
                                    style={{ background: '#F8FAFC' }}
                                >
                                    Hari ini
                                </span>
                            </div>

                            <div>
                                <div
                                    className="max-w-[85%] px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed self-start"
                                    style={{
                                        background: '#F1F5F9',
                                        color: '#1E293B',
                                        borderBottomLeftRadius: '4px',
                                    }}
                                >
                                    Jangan lupa cek tekanan darahmu malam ini ya, sesuai jadwal kontrol bulanan.
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-0.5 ml-1">09:01</div>
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-2 px-2.5 py-2 rounded-[14px] border"
                            style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}
                        >
                            <div className="flex-1 text-xs text-[#94A3B8]">Tulis pesan...</div>
                            <div
                                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0"
                                style={{ background: '#00A8A8' }}
                            >
                                <Send className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>

                        <div className="text-center mt-2.5">
                            <span className="text-[11px] text-[#94A3B8]">
                                Respons rata-rata dalam <strong className="text-[#00A8A8]">2 menit</strong>
                            </span>
                        </div>
                    </div>

                    {/* Weather Card */}
                    <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Cuaca Saat Ini
                        </div>

                        <CloudSun className="w-10 h-10 text-[#F59E0B] mb-2" />

                        <div
                            className="text-[42px] font-bold text-[#1E293B] leading-none"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            27°C
                        </div>

                        <div className="text-[13px] text-[#64748B] mt-1">Berawan sebagian · Karanganyar</div>

                        <div className="flex flex-wrap gap-3 mt-3.5">
                            <div
                                className="rounded-[10px] px-2.5 py-1.5 text-xs text-[#475569]"
                                style={{ background: '#F1F5F9' }}
                            >
                                Kelembapan <span className="font-semibold text-[#1E293B]">74%</span>
                            </div>
                            <div
                                className="rounded-[10px] px-2.5 py-1.5 text-xs"
                                style={{ background: '#F1F5F9' }}
                            >
                                UV <span className="font-semibold text-[#F97316]">Tinggi</span>
                            </div>
                            <div
                                className="rounded-[10px] px-2.5 py-1.5 text-xs text-[#475569]"
                                style={{ background: '#F1F5F9' }}
                            >
                                Angin <span className="font-semibold text-[#1E293B]">12 km/j</span>
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-1.5 mt-2.5 rounded-[10px] px-2.5 py-2 text-[11px]"
                            style={{ background: '#FFF7ED', color: '#F97316' }}
                        >
                            <Info className="w-3 h-3" />
                            Indeks UV tinggi, gunakan tabir surya saat ke luar.
                        </div>
                    </div>

                    {/* BMI Card */}
                    <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Indeks Massa Tubuh (BMI)
                        </div>

                        <div
                            className="text-[38px] font-bold text-[#00A8A8]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            22.4
                        </div>

                        <div
                            className="inline-block text-[13px] font-medium text-[#10B981] rounded-[20px] px-2.5 py-0.5 mt-1"
                            style={{ background: '#D1FAE5' }}
                        >
                            Normal / Ideal
                        </div>

                        <div className="mt-3.5">
                            <div
                                className="relative h-2.5 rounded-[99px]"
                                style={{
                                    background: 'linear-gradient(to right, #93C5FD, #10B981, #F97316, #EF4444)',
                                }}
                            >
                                <div
                                    className="absolute -top-[3px] w-4 h-4 bg-white rounded-full border-[2.5px] border-[#00A8A8]"
                                    style={{ left: '41%', transform: 'translateX(-50%)' }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                                <span>Kurus</span>
                                <span>Normal</span>
                                <span>Gemuk</span>
                                <span>Obese</span>
                            </div>
                        </div>

                        <div className="h-px bg-[#F1F5F9] my-3" />

                        <div className="flex gap-3 mt-2">
                            <div className="flex-1">
                                <div className="text-[11px] text-[#94A3B8]">Berat Badan</div>
                                <div
                                    className="text-base font-bold text-[#1E293B]"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    68 <span className="text-xs text-[#64748B] font-normal">kg</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#94A3B8]">Tinggi Badan</div>
                                <div
                                    className="text-base font-bold text-[#1E293B]"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    174 <span className="text-xs text-[#64748B] font-normal">cm</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#94A3B8]">Target</div>
                                <div
                                    className="text-base font-bold text-[#00A8A8]"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    65 <span className="text-xs text-[#64748B] font-normal">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hydration Card */}
                    <div className="rounded-[24px] p-5 border border-[#EEF2F7] bg-white">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase mb-2.5"
                            style={{ letterSpacing: '0.8px' }}>
                            Hidrasi Harian
                        </div>

                        <div className="flex items-end justify-between mb-3.5">
                            <div>
                                <div className="text-[28px] font-bold text-[#3B82F6] leading-none"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    1.8 L
                                </div>
                                <div className="text-[11px] text-text-tertiary mt-1">dari target 2.5 L / hari</div>
                            </div>
                            <div className="text-[11px] font-medium text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-[20px]">
                                72% tercapai
                            </div>
                        </div>

                        {/* Single progress bar */}
                        <div className="h-2.5 bg-[#DBEAFE] rounded-full overflow-hidden mb-3.5">
                            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: '72%' }} />
                        </div>

                        <button className="text-white rounded-[10px] px-4 py-2 text-xs font-medium cursor-pointer"
                            style={{ background: '#3B82F6', fontFamily: "'Rubik', sans-serif" }}>
                            + Tambah 250 ml
                        </button>
                    </div>

                    {/* Activity Card */}
                    <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Aktivitas Mingguan
                        </div>

                        <div
                            className="text-[26px] font-bold text-[#1E293B]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            7.240{' '}
                            <span className="text-sm font-normal text-[#64748B]">langkah</span>
                        </div>

                        <div className="text-xs text-[#64748B]">Target: 10.000 langkah/hari</div>

                        <div className="flex items-end gap-2 h-[60px] my-3">
                            {[
                                { h: '35px', bg: '#BFDBFE', day: 'Sen' },
                                { h: '55px', bg: '#BFDBFE', day: 'Sel' },
                                { h: '45px', bg: '#BFDBFE', day: 'Rab' },
                                { h: '60px', bg: '#BFDBFE', day: 'Kam' },
                                { h: '50px', bg: '#00A8A8', day: 'Jum', active: true },
                                { h: '20px', bg: '#E2E8F0', day: 'Sab', inactive: true },
                                { h: '10px', bg: '#E2E8F0', day: 'Min', inactive: true },
                            ].map((bar, i) => (
                                <div key={i} className="flex-1">
                                    <div
                                        className="w-full rounded-md"
                                        style={{ height: bar.h, background: bar.bg }}
                                    />
                                    <div
                                        className={`text-[10px] text-center mt-1 ${bar.active ? 'text-[#00A8A8] font-semibold' : bar.inactive ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'
                                            }`}
                                    >
                                        {bar.day}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-0.5">
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                                style={{ background: '#F0FDF4', color: '#10B981' }}
                            >
                                +12% vs minggu lalu
                            </span>
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                                style={{ background: '#EFF6FF', color: '#3B82F6' }}
                            >
                                Kalori: 380 kkal
                            </span>
                        </div>
                    </div>

                    {/* Nutrition Card */}
                    <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Nutrisi Hari Ini
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div
                                    className="text-[26px] font-bold text-[#1E293B]"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    1.840{' '}
                                    <span className="text-sm font-normal text-[#64748B]">kkal</span>
                                </div>
                                <div className="text-xs text-[#64748B]">dari 2.200 kkal target</div>
                            </div>
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                                style={{ background: '#FFF7ED', color: '#F97316' }}
                            >
                                360 kkal sisa
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                            {[
                                { color: '#F97316', pct: '75%', label: 'Karbo', val: '210g', offset: 28 },
                                { color: '#00A8A8', pct: '60%', label: 'Protein', val: '72g', offset: 45 },
                                { color: '#3B82F6', pct: '50%', label: 'Lemak', val: '38g', offset: 56 },
                            ].map((ring, i) => (
                                <div key={i} className="text-center">
                                    <svg width="52" height="52" viewBox="0 0 52 52">
                                        <circle cx="26" cy="26" r="20" fill="none" stroke="#F1F5F9" strokeWidth="7" />
                                        <circle
                                            cx="26"
                                            cy="26"
                                            r="20"
                                            fill="none"
                                            stroke={ring.color}
                                            strokeWidth="7"
                                            strokeDasharray="113"
                                            strokeDashoffset={ring.offset}
                                            strokeLinecap="round"
                                            transform="rotate(-90 26 26)"
                                        />
                                        <text
                                            x="26"
                                            y="30"
                                            textAnchor="middle"
                                            fontSize="10"
                                            fontWeight="700"
                                            fill="#1E293B"
                                        >
                                            {ring.pct}
                                        </text>
                                    </svg>
                                    <div className="text-[11px] text-[#64748B] mt-1">{ring.label}</div>
                                    <div
                                        className="text-[13px] font-bold text-[#1E293B]"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {ring.val}
                                    </div>
                                </div>
                            ))}

                            <div className="flex-1 ml-2">
                                <div
                                    className="rounded-[10px] px-2.5 py-2 text-[11px] text-[#64748B] leading-relaxed"
                                    style={{ background: '#F8FAFC', lineHeight: '1.6' }}
                                >
                                    Makan malam ideal dengan sayuran hijau dan protein tanpa lemak untuk memenuhi target.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthDashboard;
