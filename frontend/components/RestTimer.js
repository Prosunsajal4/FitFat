import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const presetTimes = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
  { label: '5m', seconds: 300 },
];

export default function RestTimer({ onComplete, onClose }) {
  const [selectedTime, setSelectedTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            playSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {}
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsFinished(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
  };

  const selectTime = (seconds) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedTime - timeLeft) / selectedTime) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="glass-card p-8 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-heading font-bold mb-6">⏱️ Rest Timer</h2>

        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={isFinished ? '#39ff14' : isRunning ? '#b026ff' : '#39ff14'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-heading font-bold ${isFinished ? 'text-neon-green animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
            {isFinished && (
              <span className="text-neon-green text-sm mt-2 animate-bounce">TIME'S UP!</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {presetTimes.map((preset) => (
            <button
              key={preset.seconds}
              onClick={() => selectTime(preset.seconds)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                selectedTime === preset.seconds
                  ? 'bg-neon-green text-black'
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {!isRunning && !isFinished && (
            <button
              onClick={startTimer}
              className="flex-1 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
            >
              Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseTimer}
              className="flex-1 py-3 bg-neon-purple text-white font-bold rounded-lg hover:bg-neon-purple/90"
            >
              Pause
            </button>
          )}
          {isFinished && (
            <button
              onClick={() => { onComplete && onComplete(); onClose(); }}
              className="flex-1 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
            >
              Done
            </button>
          )}
          <button
            onClick={resetTimer}
            className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:text-white text-sm"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}