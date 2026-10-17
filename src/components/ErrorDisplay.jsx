import { AlertTriangle, WifiOff, RefreshCw, Terminal, ServerOff, HelpCircle } from 'lucide-react';

const ERROR_CONFIG = {
  CONNECTION_ERROR: {
    icon: WifiOff,
    title: 'Ollama Not Reachable',
    color: 'text-rose-500 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/25',
    instructions: [
      'Make sure Ollama is installed on your system',
      'Start Ollama by running: ollama serve',
      'Verify it\'s running at http://localhost:11434',
    ],
  },
  MODEL_ERROR: {
    icon: ServerOff,
    title: 'Model Not Found',
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/25',
    instructions: [
      'Pull the required model by running:',
      'ollama pull qwen3.5:9b',
      'Then try generating again',
    ],
  },
  PARSE_ERROR: {
    icon: AlertTriangle,
    title: 'Invalid Response',
    color: 'text-orange-500 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/25',
    instructions: [
      'The AI returned malformed data',
      'This is usually temporary — try again',
      'If it persists, try a simpler destination',
    ],
  },
  TIMEOUT_ERROR: {
    icon: RefreshCw,
    title: 'Request Timed Out',
    color: 'text-sky-500 dark:text-sky-400',
    bgColor: 'bg-sky-500/10 border-sky-500/25',
    instructions: [
      'The model took too long to respond',
      'Try reducing the number of days to 2–3',
      'Shorter trips generate much faster',
    ],
  },
  UNKNOWN_ERROR: {
    icon: HelpCircle,
    title: 'Something Went Wrong',
    color: 'text-slate-600 dark:text-white/60',
    bgColor: 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10',
    instructions: [
      'An unexpected error occurred',
      'Check the console for details',
      'Try again in a few seconds',
    ],
  },
};

export default function ErrorDisplay({ error, onRetry }) {
  const config = ERROR_CONFIG[error?.type] || ERROR_CONFIG.UNKNOWN_ERROR;
  const Icon = config.icon;

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <div className={`glass-card p-6 sm:p-8 border ${config.bgColor} space-y-5`}>
        {/* Icon + Title */}
        <div className="text-center space-y-3">
          <div className={`inline-flex p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.04] ${config.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className={`text-xl font-bold font-[Outfit] ${config.color}`}>
            {config.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-white/50">
            {error?.message || 'An error occurred while generating your itinerary.'}
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          {config.instructions.map((instruction, i) => {
            const isCommand = instruction.startsWith('ollama ') || instruction.includes('localhost');
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] text-slate-600 dark:text-white/40 font-mono font-bold">{i + 1}</span>
                </span>
                {isCommand ? (
                  <code className="text-sm font-mono text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded border border-brand-200 dark:border-transparent">
                    {instruction}
                  </code>
                ) : (
                  <span className="text-sm text-slate-700 dark:text-white/60">{instruction}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Retry button */}
        <button
          onClick={onRetry}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-300 dark:border-white/[0.08] text-slate-800 dark:text-white/70 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:text-slate-900 dark:hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        {/* Terminal hint */}
        {(error?.type === 'CONNECTION_ERROR' || error?.type === 'MODEL_ERROR') && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-800/50 border border-slate-200 dark:border-white/[0.04]">
            <Terminal className="w-3.5 h-3.5 text-slate-500 dark:text-white/30" />
            <span className="text-xs text-slate-500 dark:text-white/30 font-mono">
              Need help? Check the Ollama docs at ollama.com
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
