
interface BannerChipProps {
    val: string,
    lbl: string
}

const BannerChip = ({ val, lbl }: BannerChipProps) => (
    <div className="rounded-xl px-3.5 py-2" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
        <div className="text-[17px] font-bold text-center text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {val}
        </div>
        <div className="text-[11px] text-center text-white/70">{lbl}</div>
    </div>
);

export default BannerChip