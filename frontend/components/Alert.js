const typeStyles = {
  info: 'border-l-blue-500 bg-blue-500/10',
  success: 'border-l-neon-green bg-neon-green/10',
  warning: 'border-l-yellow-500 bg-yellow-500/10',
  error: 'border-l-red-500 bg-red-500/10',
};

const typeIcons = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export default function Alert({ type = 'info', children, onClose }) {
  return (
    <div
      className={`flex items-start gap-3 p-4 border-l-4 rounded-r-lg ${typeStyles[type] || typeStyles.info}`}
    >
      <span className="text-lg mt-0.5">{typeIcons[type]}</span>
      <div className="flex-1 text-sm text-gray-200">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
