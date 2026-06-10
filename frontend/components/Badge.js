const variantStyles = {
  green: 'bg-neon-green/10 text-neon-green border-neon-green/30',
  purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
  gray: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({ children, variant = 'green', size = 'sm' }) {
  return (
    <span
      className={`glass-card inline-flex items-center font-medium border rounded-full ${variantStyles[variant] || variantStyles.green} ${sizeStyles[size] || sizeStyles.sm}`}
    >
      {children}
    </span>
  );
}
