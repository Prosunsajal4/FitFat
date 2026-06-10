export default function Divider({ label }) {
  if (label) {
    return (
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
    );
  }

  return <hr className="border-gray-700 my-6" />;
}
