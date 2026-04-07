import { StrictMode, Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";
import { isSupabaseConfigured } from "./db/supabase.ts";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Application Error:", error, errorInfo);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#111] border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Configuration Error Screen
function ConfigurationError() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#111] border border-amber-500/20 rounded-2xl p-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2 text-center">Configuration Required</h1>
        <p className="text-gray-400 mb-6 text-sm text-center">
          Supabase credentials are not configured. Please add the following environment variables:
        </p>
        <div className="bg-[#0a0a0a] rounded-xl p-4 font-mono text-sm mb-6 border border-white/5">
          <p className="text-amber-400">VITE_SUPABASE_URL</p>
          <p className="text-amber-400">VITE_SUPABASE_ANON_KEY</p>
        </div>
        <p className="text-gray-500 text-xs text-center">
          You can find these values in your Supabase project dashboard under Settings &gt; API.
        </p>
      </div>
    </div>
  );
}

// Initialize Sentry for real-time error tracking
Sentry.init({
  dsn: "https://7264a9388c3a886b45f4706598375811@o4508920959074304.ingest.us.sentry.io/4508920970346496",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      {!isSupabaseConfigured ? (
        <ConfigurationError />
      ) : (
        <SettingsProvider>
          <AuthProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </AuthProvider>
        </SettingsProvider>
      )}
    </ErrorBoundary>
  </StrictMode>
);
