export default function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-7xl mb-4">{icon}</div>
      <h3 className="text-xl font-heading font-bold mb-2 text-gray-200">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-neon-green/20 text-neon-green border border-neon-green/30 rounded-lg font-medium hover:bg-neon-green/30 transition-all"
        >
          {action}
        </button>
      )}
    </div>
  );
}
