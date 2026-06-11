const colorMap = {
  green: {
    low: 'shadow-[0_0_8px_rgba(57,255,20,0.3)]',
    medium: 'shadow-[0_0_16px_rgba(57,255,20,0.5)]',
    high: 'shadow-[0_0_28px_rgba(57,255,20,0.7)]',
  },
  purple: {
    low: 'shadow-[0_0_8px_rgba(176,38,255,0.3)]',
    medium: 'shadow-[0_0_16px_rgba(176,38,255,0.5)]',
    high: 'shadow-[0_0_28px_rgba(176,38,255,0.7)]',
  },
};

const borderMap = {
  green: {
    low: 'border-neon-green/30',
    medium: 'border-neon-green/50',
    high: 'border-neon-green/70',
  },
  purple: {
    low: 'border-neon-purple/30',
    medium: 'border-neon-purple/50',
    high: 'border-neon-purple/70',
  },
};

export default function GlowBorder({ children, color = 'green', intensity = 'medium' }) {
  const glow = colorMap[color]?.[intensity] || colorMap.green.medium;
  const border = borderMap[color]?.[intensity] || borderMap.green.medium;

  return (
    <div className={`relative rounded-xl border ${border} ${glow} transition-shadow duration-500 animate-glow`}>
      {children}
    </div>
  );
}
