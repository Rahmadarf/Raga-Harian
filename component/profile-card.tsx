

interface ProfileCardProps {
    Initial: string,
    Name: string,
    Online?: boolean,
    Additional: string
}

const ProfileCard = ({ Initial, Name, Online, Additional }: ProfileCardProps) => {
    return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 bg-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {Initial}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-text-muted">{Name}</div>
                <div className="text-[10px] text-text-secondary">{Additional}</div>
            </div>
            {Online && (
                <div className="ml-auto flex items-center gap-1 text-[10px] text-success">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Online
                </div>
            )}
        </div>
    )
}

export default ProfileCard
