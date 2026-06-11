const colorMap = {
  green: { stroke: '#39ff14', shadow: 'drop-shadow(0 0 6px rgba(57,255,20,0.6))' },
  purple: { stroke: '#b026ff', shadow: 'drop-shadow(0 0 6px rgba(176,38,255,0.6))' },
  yellow: { stroke: '#facc15', shadow: 'drop-shadow(0 0 6px rgba(250,204,21,0.6))' },
};

export default function ProgressBarCircular({
  value = 0,
  size = 80,
  strokeWidth = 6,
  color = 'green',
  label,
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const { stroke, shadow } = colorMap[color] || colorMap.green;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ filter: shadow }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {label && (
        <span className="text-xs text-gray-400 mt-1">{label}</span>
      )}
    </div>
  );
}
