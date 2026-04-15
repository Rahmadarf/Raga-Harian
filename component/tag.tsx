

interface TagProps {
    text: string,
    type: 'green' | 'orange' | 'blue' | 'red' | 'teal' | 'gray'
}

const Tag = ({ text, type }: TagProps) => {
    const styles = {
        green: { background: '#F0FDF4', color: '#10B981' },
        orange: { background: '#FFF7ED', color: '#F97316' },
        blue: { background: '#EFF6FF', color: '#3B82F6' },
        red: { background: '#FEF2F2', color: '#EF4444' },
        teal: { background: 'rgba(0, 168, 168, 0.1)', color: '#00A8A8' },
        gray: { background: '#F1F5F9', color: '#64748B' },
    };
    return (
        <span className="text-[11px] px-2.5 py-0.5 rounded-[20px] font-medium inline-flex items-center gap-1" style={styles[type]}>
            {text}
        </span>
    );
};

export default Tag