

interface TagProps {
    text: string,
    type: 'green' | 'orange' | 'blue' | 'red' | 'teal' | 'gray'
}

const Tag = ({ text, type }: TagProps) => {
    const styles = {
        green: { background: 'var(--color-tag-green-bg)', color: 'var(--color-tag-green-text)' },
        orange: { background: 'var(--color-tag-orange-bg)', color: 'var(--color-tag-orange-text)' },
        blue: { background: 'var(--color-tag-blue-bg)', color: 'var(--color-tag-blue-text)' },
        red: { background: 'var(--color-tag-red-bg)', color: 'var(--color-tag-red-text)' },
        teal: { background: 'var(--color-tag-teal-bg)', color: 'var(--color-tag-teal-text)' },
        gray: { background: 'var(--color-tag-gray-bg)', color: 'var(--color-tag-gray-text)' },
    };
    return (
        <span className="text-[11px] px-2.5 py-0.5 rounded-[20px] font-medium inline-flex items-center gap-1" style={styles[type]}>
            {text}
        </span>
    );
};

export default Tag
