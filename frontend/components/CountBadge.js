export default function CountBadge({ count, max = 99 }) {
  const display = count > max ? `${max}+` : String(count);

  return (
    <span
      className="
        inline-flex items-center justify-center
        min-w-[20px] h-5 px-1.5
        bg-red-500 text-white text-xs font-bold
        rounded-full leading-none
        shadow-lg shadow-red-500/30
      "
    >
      {display}
    </span>
  );
}
