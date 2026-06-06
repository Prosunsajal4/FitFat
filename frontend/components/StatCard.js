import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, color = 'neon-green', delay = 0, trend }) {
  const colorMap = {
    'neon-green': 'text-neon-green',
    'neon-purple': 'text-neon-purple',
    'cyan-400': 'text-cyan-400',
    'yellow-400': 'text-yellow-400',
    'red-400': 'text-red-400',
    'blue-400': 'text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-4 hover:border-neon-green/30 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-bold ${trend > 0 ? 'text-neon-green' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className={`text-2xl font-heading font-bold ${colorMap[color] || 'text-neon-green'}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}