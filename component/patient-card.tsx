
const patients = [
    { id: 'dimas', name: 'Dimas Kurniawan', initials: 'DK', age: 28, gender: 'Laki-laki', bmi: '22.4', td: '118/78', bg: '#00A8A8', email: 'dimas@mail.com', status: 'Sehat' },
    { id: 'siti', name: 'Siti Rahayu', initials: 'SR', age: 38, gender: 'Perempuan', bmi: '27.1', td: '124/82', bg: '#3B82F6', email: 'siti@mail.com', status: 'Perhatian' },
    { id: 'ahmad', name: 'Ahmad Fauzi', initials: 'AF', age: 52, gender: 'Laki-laki', bmi: '25.8', td: '138/88', bg: '#F97316', email: 'ahmad@mail.com', status: 'Dipantau' },
    { id: 'linda', name: 'Linda Maulida', initials: 'LM', age: 34, gender: 'Perempuan', bmi: '21.2', td: '115/75', bg: '#8B5CF6', email: 'linda@mail.com', status: 'Sehat' },
    { id: 'budi', name: 'Budi Santoso', initials: 'BS', age: 45, gender: 'Laki-laki', bmi: '29.4', td: '142/92', bg: '#EF4444', email: 'budi@mail.com', status: 'Segera' },
    { id: 'rina', name: 'Rina Anggraini', initials: 'RA', age: 29, gender: 'Perempuan', bmi: '20.8', td: '112/72', bg: '#10B981', email: 'rina@mail.com', status: 'Sehat' },
];

interface PatientCardProps {
    p: typeof patients[0];
    active: boolean;
    onClick: () => void;
    showUnread?: boolean;
    unreadCount?: number;
    lastMsg?: string;
    time?: string;
}


const PatientCard = ({ p, active, onClick, showUnread, unreadCount, lastMsg, time }: PatientCardProps) => (
    <div
        key={p.id}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-[14px] cursor-pointer transition-colors border-[1.5px] border-transparent ${active ? 'bg-[rgba(0,168,168,0.06)] border-[#00A8A8]' : 'hover:bg-[#F8FAFC]'}`}
    >
        <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0"
            style={{ background: p.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {p.initials}
        </div>
        <div className="flex-1 min-w-0">
            <div className="font-medium text-[13px] text-[#1E293B] truncate">{p.name}</div>
            {lastMsg && <div className="text-[11px] text-[#64748B] truncate whitespace-nowrap overflow-hidden">{lastMsg}</div>}
        </div>
        {(time || showUnread) && (
            <div className="text-right flex-shrink-0">
                {time && <div className="text-[10px] text-[#94A3B8] mb-1">{time}</div>}
                {showUnread && unreadCount && unreadCount > 0 && (
                    <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold text-white ml-auto" style={{ background: '#F97316' }}>
                        {unreadCount}
                    </div>
                )}
            </div>
        )}
    </div>
);

export default PatientCard;