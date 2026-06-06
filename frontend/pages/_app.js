import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastProvider } from '../components/Toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>FitFat - AI-Powered Gym & Fitness Tracker</title>
        <meta name="description" content="Track workouts, nutrition, body progress with AI-powered fitness coaching. Bangladeshi diet plans included." />
        <meta name="keywords" content="fitness, gym, workout, tracker, AI, diet, Bangladeshi, exercise, health" />
        <meta name="author" content="Prosun Mukherjee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta property="og:title" content="FitFat - AI-Powered Gym & Fitness Tracker" />
        <meta property="og:description" content="Track workouts, nutrition, body progress with AI-powered fitness coaching." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FitFat - AI-Powered Gym & Fitness Tracker" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💪</text></svg>" />
      </Head>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;