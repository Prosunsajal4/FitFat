import { useEffect } from 'react';

export default function ConfirmToast({ message, onConfirm, onCancel, type = 'warning' }) {
  const typeStyles = {
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    danger: 'bg-red-500/10 border-red-500/30',
  };

  const buttonStyles = {
    warning: 'bg-yellow-500 hover:bg-yellow-400 text-black',
    danger: 'bg-red-500 hover:bg-red-400 text-white',
  };

  useEffect(() => {
    const timer = setTimeout(() => onCancel?.(), 5000);
    return () => clearTimeout(timer);
  }, [onCancel]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-in-down">
      <div
        className={`
          flex items-center gap-4 px-5 py-3.5 rounded-xl border
          backdrop-blur-xl shadow-2xl
          ${typeStyles[type]}
        `}
      >
        <p className="text-sm font-medium text-white">{message}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onConfirm}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${buttonStyles[type]}`}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
