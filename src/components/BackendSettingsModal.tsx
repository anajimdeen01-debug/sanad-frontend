import React, { useState } from 'react';
import { Server, Wifi, RefreshCw, CheckCircle2, AlertCircle, Code } from 'lucide-react';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  isBackendLive: boolean;
  onUpdateApiUrl: (url: string) => void;
  onRefreshCheck: () => Promise<void>;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
  apiUrl,
  isBackendLive,
  onUpdateApiUrl,
  onRefreshCheck,
}) => {
  const [inputUrl, setInputUrl] = useState(apiUrl);
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndCheck = async () => {
    setChecking(true);
    onUpdateApiUrl(inputUrl);
    await onRefreshCheck();
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isBackendLive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-white/10 text-slate-400'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Backend Connection & API Contract</h3>
              <p className="text-xs text-slate-400">FastAPI Corporate Banking Server</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Current Status Banner */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
          isBackendLive 
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
            : 'bg-slate-900/80 border-white/10 text-slate-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendLive ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isBackendLive ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <div>
              <p className="text-xs font-bold text-white">
                {isBackendLive ? 'FastAPI Backend Online (200 OK)' : 'Autonomous In-Browser AI Engine Active'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isBackendLive 
                  ? 'All calls routing directly to live server via Authorization: Bearer token.' 
                  : 'FastAPI server not detected on target port. Built-in high-fidelity engine active with instant zero-latency processing.'}
              </p>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-slate-300 font-semibold">Backend API Base URL:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSaveAndCheck}
              disabled={checking}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              <span>Ping</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Standard port: <code className="text-slate-300 font-mono">http://localhost:8000</code> (FastAPI)
          </p>
        </div>

        {/* Implemented API Contract Endpoints Checklist */}
        <div className="bg-slate-950 p-3 rounded-xl border border-white/10 space-y-2 text-[11px]">
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>Implemented API Endpoints:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>POST /api/login</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>GET /api/businesses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>POST /api/businesses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>POST /api/.../upload</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>GET /api/evaluations/:id</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>POST /api/evaluations/:id/approve</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>GET /api/evaluations/:id/export</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>GET /api/audit</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
