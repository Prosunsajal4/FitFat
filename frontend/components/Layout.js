import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Workouts', path: '/workouts', icon: '💪' },
  { name: 'AI Workout', path: '/ai-workout', icon: '🤖' },
  { name: 'Diet Plan', path: '/diet', icon: '🍛' },
  { name: 'Progress', path: '/progress', icon: '📈' },
  { name: 'Nutrition', path: '/nutrition', icon: '🥗' },
  { name: 'AI Coach', path: '/coach', icon: '💬' },
  { name: 'Analytics', path: '/analytics', icon: '📉' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getLevelName = (level) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Pro', 'Beast', 'Legend'];
    return levels[level - 1] || 'Beginner';
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-dark-secondary border-r border-gray-800 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Link href="/dashboard">
                <h1 className="text-2xl font-heading font-bold gradient-text">FitFat</h1>
              </Link>
          <button
            onClick={() => { setMobileMenuOpen(false); setSidebarOpen(false); }}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-card"
            aria-label="Close menu"
          >
            <span className="text-2xl">✕</span>
          </button>
            </div>
            {user && (
              <div className="mt-4 p-3 bg-dark-card rounded-lg">
                <p className="text-white font-medium">{user.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-neon-purple text-sm">Level {user.stats?.level || 1}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-neon-green text-sm">{getLevelName(user.stats?.level || 1)}</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>XP: {user.stats?.xp || 0}</span>
                    <span>🔥 {user.stats?.streak || 0} day streak</span>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        router.pathname === item.path
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                          : 'text-gray-400 hover:bg-dark-card hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                aria-label="Logout"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-dark-secondary border-b border-gray-800 p-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <span className="text-2xl">☰</span>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 text-gray-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <span className="text-xl">{sidebarOpen ? '◀' : '▶'}</span>
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}