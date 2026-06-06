import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold gradient-text mb-2">FitFat</h1>
            <p className="text-gray-400">Reset Your Password</p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neon-green/20 border border-neon-green text-neon-green px-4 py-3 rounded-lg text-sm mb-6"
            >
              <p>{message}</p>
              {resetToken && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">Your reset token (use this to reset password):</p>
                  <code className="block p-2 bg-dark-bg rounded text-xs break-all">{resetToken}</code>
                  <Link href={`/reset-password?token=${resetToken}`} className="mt-3 block text-center py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90">
                    Reset Password Now
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-neon-green"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Remember your password?{' '}
              <Link href="/login" className="text-neon-green hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}