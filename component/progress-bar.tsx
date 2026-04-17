
interface ProgressBarProps {
    width: string,
    color: string,
}

const ProgressBar = ({ width, color }: ProgressBarProps) => (
    <div className="h-2 bg-gray-100 rounded-[99px] overflow-hidden">
        <div className="h-full rounded-[99px]" style={{ width, background: color }} />
    </div>
);

export default ProgressBar;
