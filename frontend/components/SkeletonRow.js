export default function SkeletonRow({ lines = 3, avatar = false }) {
  return (
    <div className="flex items-start gap-3 p-4">
      {avatar && (
        <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse shrink-0" />
      )}
      <div className="flex-1 space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-gray-800 rounded-full animate-pulse ${
              i === 0 ? 'w-3/4' : i === lines - 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
