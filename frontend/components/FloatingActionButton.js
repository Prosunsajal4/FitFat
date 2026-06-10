import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: '💪', label: 'Log Workout', href: '/workouts' },
    { icon: '🍎', label: 'Log Meal', href: '/nutrition' },
    { icon: '📊', label: 'Progress', href: '/progress' },
    { icon: '🤖', label: 'AI Coach', href: '/coach' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action) => (
              <Link key={action.label} href={action.href} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-gray-700 rounded-full text-sm whitespace-nowrap shadow-lg">
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-neon-green text-black rounded-full shadow-lg flex items-center justify-center text-2xl font-bold hover:scale-105 transition-transform"
      >
        {open ? '✕' : '+'}
      </button>
    </div>
  );
}
