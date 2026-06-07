import { useState, useEffect } from 'react';

export default function DBStatusBanner() {
  const [status, setStatus] = useState('checking');
  const [retrying, setRetrying] = useState(false);

  const checkHealth = async () => {
    try {
      const res = await fetch('https://fitfatbackend.vercel.app/api/health');
      const data = await res.json();
      if (data.mongo === 'connected') {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch {
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    await checkHealth();
    setRetrying(false);
  };

  if (status === 'connected') return null;

  return (
    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-bold text-sm">Database Unavailable</p>
          <p className="text-xs text-red-400/80">
            {status === 'checking' ? 'Checking connection...' : 'MongoDB is waking up from cold start. This may take 30-60 seconds.'}
          </p>
        </div>
      </div>
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-sm font-bold transition-colors disabled:opacity-50"
      >
        {retrying ? '...' : 'Retry'}
      </button>
    </div>
  );
}
