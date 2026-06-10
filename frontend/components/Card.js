const paddingStyles = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({ children, className = '', padding = 'md' }) {
  return (
    <div className={`glass-card rounded-xl ${paddingStyles[padding] || paddingStyles.md} ${className}`}>
      {children}
    </div>
  );
}
