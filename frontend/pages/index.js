import Link from 'next/link';
import { motion } from 'framer-motion';

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-heading font-bold gradient-text">FitFat</h1>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-neon-green transition-colors">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 transition-all">
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
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-heading font-bold gradient-text">FitFat</span>
            </div>
            <p className="text-gray-500">© 2026 FitFat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}