export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-3"></div>
      <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-gray-700 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-700/30 rounded-lg"></div>
    </div>
  );
}

export function SkeletonAvatar() {
  return (
    <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-700 rounded mb-2"
          style={{ width: `${100 - i * 20}%` }}
        ></div>
      ))}
    </div>
  );
}