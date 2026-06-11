export default function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="
            text-sm font-medium text-[#39FF14] hover:text-[#39FF14]/80
            transition-colors px-3 py-1.5 rounded-lg
            hover:bg-[#39FF14]/10
          "
        >
          {action}
        </button>
      )}
    </div>
  );
}
