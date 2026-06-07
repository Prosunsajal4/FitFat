import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';

const quickQuestions = [
  "What should I train today?",
  "Am I overtraining?",
  "Help me with my diet",
  "Why is my progress stalling?",
  "Give me a motivation boost",
];

function CoachContent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const res = await aiAPI.getChatHistory();
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: 'Hey there! I\'m your AI fitness coach. Ask me anything about workouts, nutrition, or fitness advice! 💪',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([
        {
          role: 'assistant',
          content: 'Hey there! I\'m your AI fitness coach. Ask me anything about workouts, nutrition, or fitness advice! 💪',
        },
      ]);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(message);
      const aiMessage = { role: 'assistant', content: res.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I\'m having trouble responding right now. Please try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await aiAPI.clearChat();
      setMessages([
        {
          role: 'assistant',
          content: 'Chat cleared! How can I help you today? 💪',
        },
      ]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <div className="space-y-6">
      <DBStatusBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">AI Fitness Coach</h1>
          <p className="text-gray-400">Chat with your personal AI fitness assistant</p>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 bg-dark-card rounded-lg text-gray-400 hover:text-white"
        >
          Clear Chat
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass-card h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-neon-green/20 border border-neon-green/30 text-white'
                        : 'bg-dark-bg border border-gray-700 text-gray-200'
                    }`}
                  >
                    <div className="text-sm mb-1 opacity-50">{msg.role === 'user' ? 'You' : 'FitFat AI'}</div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-dark-bg border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-gray-400 ml-2">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your fitness question..."
                  className="flex-1 px-4 py-3 rounded-lg bg-dark-bg border border-gray-700 focus:border-neon-green"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 disabled:opacity-50"
                >
                  {loading ? '...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="font-bold mb-3">Quick Questions</h3>
            <div className="space-y-2">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-dark-bg rounded-lg text-sm hover:bg-dark-card transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-bold mb-3">What I can help with</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>🏋️ Workout recommendations</li>
              <li>🥗 Nutrition advice</li>
              <li>💪 Training tips</li>
              <li>📊 Progress analysis</li>
              <li>🔥 Motivation & support</li>
              <li>⚠️ Overtraining warnings</li>
            </ul>
          </div>

          <div className="glass-card p-4 border-l-4 border-neon-purple">
            <h3 className="font-bold mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-gray-400">
              The more you chat, the better I understand your fitness journey and can provide personalized advice!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Coach() {
  return (
    <ProtectedRoute>
      <CoachContent />
    </ProtectedRoute>
  );
}