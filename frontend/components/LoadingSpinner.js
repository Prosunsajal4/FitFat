const sizeStyles = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ size = 'md' }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeStyles[size] || sizeStyles.md} border-gray-700 border-t-neon-green rounded-full animate-spin`}
      />
    </div>
  );
}
