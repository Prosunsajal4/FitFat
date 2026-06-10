const colorStyles = {
  green: 'bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)]',
  purple: 'bg-neon-purple shadow-[0_0_10px_rgba(176,38,255,0.5)]',
  yellow: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]',
};

export default function ProgressBar({ value = 0, color = 'green', label, showPercent = false }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showPercent && <span className="text-sm text-gray-400">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color] || colorStyles.green}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
