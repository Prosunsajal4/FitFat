const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

const variantStyles = {
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white',
  solid: 'bg-neon-green/10 hover:bg-neon-green/20 text-neon-green',
};

export default function IconButton({ icon, onClick, size = 'md', variant = 'ghost', title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-full flex items-center justify-center transition-colors ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.ghost}`}
    >
      {icon}
    </button>
  );
}
