export default function StatBlock({ label, value, icon, trend, trendValue }) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    flat: 'text-gray-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    flat: '→',
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        {icon && <span className="text-gray-500">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && trendValue && (
          <span className={`text-sm font-medium ${trendColors[trend]} mb-1`}>
            {trendIcons[trend]} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
