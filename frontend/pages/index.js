import Link from 'next/link';
import { motion } from 'framer-motion';

const developerInfo = {
  name: 'Prosun Mukherjee',
  title: 'MERN Stack Developer',
  email: 'prosunsajal123@gmail.com',
  phone: '+8801911572117',
  location: 'Khulna, Bangladesh',
  github: 'https://github.com/Prosunsajal4',
  linkedin: 'https://linkedin.com/in/prosun-mukherjee',
  portfolio: 'https://prosun-mukherjee.vercel.app'
};

export default function Landing() {
  const features = [
    { icon: '💪', title: 'Workout Tracking', desc: 'Track sets, reps, weight with real-time volume calculation' },
    { icon: '🤖', title: 'AI Coach', desc: 'Get personalized workout plans and fitness advice' },
    { icon: '📈', title: 'Progress Analytics', desc: 'Visualize your gains with beautiful charts' },
    { icon: '🥗', title: 'Nutrition Tracking', desc: 'Log meals, calories, protein, and water intake' },
    { icon: '🔥', title: 'Streak System', desc: 'Stay motivated with XP, levels, and achievement badges' },
    { icon: '⚖️', title: 'Body Metrics', desc: 'Track weight, measurements, and body fat percentage' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-heading font-bold gradient-text">FitFat</h1>
              <span className="hidden md:inline-block text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">
                by {developerInfo.name}
              </span>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:flex items-center gap-4">
                <a href={developerInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href={developerInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href={developerInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Portfolio">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </a>
              </div>
              <Link href="/login" className="text-gray-300 hover:text-neon-green transition-colors text-sm">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 transition-all text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-full text-neon-green text-sm mb-6">
                AI-Powered Fitness Tracker
              </span>
              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                Transform Your
                <span className="block gradient-text">Fitness Journey</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Track workouts, get AI-powered recommendations, monitor nutrition, and level up your fitness game with gamified features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="px-8 py-4 bg-neon-green text-black font-bold text-lg rounded-xl hover:bg-neon-green/90 transition-all hover:scale-105">
                  Start Free Trial
                </Link>
                <Link href="/login" className="px-8 py-4 glass-card text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all">
                  Login
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            >
              {[
                { number: '10K+', label: 'Active Users' },
                { number: '500K+', label: 'Workouts Logged' },
                { number: '98%', label: 'Satisfaction' },
                { number: '24/7', label: 'AI Support' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6">
                  <div className="text-3xl font-bold text-neon-green mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">
              Everything You Need to <span className="text-neon-purple">Transform</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you achieve your fitness goals faster than ever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:border-neon-green/50 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-neon-purple/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-neon-purple font-bold">🤖 AI POWERED</span>
              <h2 className="text-4xl font-heading font-bold mt-4 mb-6">
                Your Personal AI Fitness Coach
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Get personalized workout plans, nutrition advice, and fitness guidance tailored to your goals, experience level, and body type.
              </p>
              <ul className="space-y-4">
                {[
                  'Custom workout plans based on your goals',
                  'Nutrition recommendations',
                  'Progress predictions & insights',
                  '24/7 chat support for fitness questions',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-neon-green">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 border-2 border-neon-purple/30"
            >
              <div className="bg-dark-bg rounded-xl p-6 font-mono text-sm">
                <div className="text-gray-400 mb-2">AI Coach:</div>
                <p className="text-white">"Based on your recent workouts, I recommend focusing on leg day tomorrow! Your upper body volume is 40% higher than your lower body. Add Bulgarian split squats and leg press to balance it out!"</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 bg-neon-purple/20 rounded text-xs">Personalized</span>
                  <span className="px-2 py-1 bg-neon-green/20 rounded text-xs">Data-Driven</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center border-2 border-neon-green/30"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">
              Ready to Transform?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of fitness enthusiasts achieving their goals with FitFat.
            </p>
            <Link href="/register" className="inline-block px-10 py-4 bg-gradient-to-r from-neon-green to-neon-purple text-black font-bold text-xl rounded-xl hover:scale-105 transition-all">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-dark-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-heading font-bold gradient-text mb-4">FitFat</h3>
              <p className="text-gray-400 text-sm">
                AI-Powered Fitness Tracker built with modern web technologies. Transform your fitness journey with intelligent tracking and personalized AI coaching.
              </p>
            </div>

            {/* Developer Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Developer</h4>
              <div className="space-y-2">
                <p className="text-neon-green font-medium">{developerInfo.name}</p>
                <p className="text-gray-400 text-sm">{developerInfo.title}</p>
                <p className="text-gray-500 text-sm">{developerInfo.location}</p>
              </div>
              <div className="flex gap-4 mt-4">
                <a href={developerInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href={developerInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href={developerInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <a href={`mailto:${developerInfo.email}`} className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {developerInfo.email}
                </a>
                <a href={`tel:${developerInfo.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {developerInfo.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 FitFat. Built by Prosun Mukherjee with ❤️</p>
            <p className="text-gray-500 text-sm">MERN Stack • Next.js • MongoDB • AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}