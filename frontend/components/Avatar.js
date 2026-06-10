const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
};

export default function Avatar({ name = '', size = 'md', image }) {
  const initials = name.charAt(0).toUpperCase();

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`rounded-full border-2 border-neon-green object-cover ${sizeStyles[size] || sizeStyles.md}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full border-2 border-neon-green bg-neon-green/10 text-neon-green flex items-center justify-center font-bold ${sizeStyles[size] || sizeStyles.md}`}
    >
      {initials}
    </div>
  );
}
