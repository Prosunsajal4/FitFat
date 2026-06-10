const colorStyles = {
  green: 'bg-neon-green/10 text-neon-green border-neon-green/30',
  purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
  gray: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

export default function Chip({ children, color = 'green', removable = false, onRemove }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${colorStyles[color] || colorStyles.green}`}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          &times;
        </button>
      )}
    </span>
  );
}
