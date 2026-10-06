import React, { useState } from 'react';
import { Database, Search, ArrowRight, CheckCircle2, Loader2, Sparkles, Building2, Shield, Landmark, FileSpreadsheet } from 'lucide-react';
import { Business } from '../types';

interface LiveSourcePullerProps {
  onSelectBusinessByCr: (crNumber: string) => Promise<void>;
  businesses: Business[];
  isPulling: boolean;
  lang?: 'en' | 'ar';
}

export const LiveSourcePuller: React.FC<LiveSourcePullerProps> = ({
  onSelectBusinessByCr,
  businesses,
  isPulling,
  lang = 'en',
}) => {
  const [crInput, setCrInput] = useState('');
  const [pullProgress, setPullProgress] = useState<{ step: string; percent: number } | null>(null);

  const presets = [
    { name: 'Qabas Trading Co.', cr: 'CR-1149204-KW', tag: 'High Risk / Lien Conflict' },
    { name: 'Al-Manar Industrial', cr: 'CR-892410-KW', tag: 'Moderate / Taharah Due' },
    { name: 'Gulf Pearl Logistics', cr: 'CR-451290-KW', tag: 'Prime Asset Grade' },
  ];

  const handlePull = async (targetCr: string) => {
    if (!targetCr.trim()) return;
    setPullProgress({ step: 'Connecting to MOCI Kuwait Commercial Registry API...', percent: 25 });
    await new Promise(r => setTimeout(r, 400));
    setPullProgress({ step: 'Pulling Central Bank of Kuwait (CBK / CiNet) Credit Bureau Report...', percent: 50 });
    await new Promise(r => setTimeout(r, 450));
    setPullProgress({ step: 'Extracting Warba Bank Finacle Core Banking transaction history...', percent: 75 });
    await new Promise(r => setTimeout(r, 450));
    setPullProgress({ step: 'Cross-synthesizing all 4 sources into certified client dossier...', percent: 95 });
    await new Promise(r => setTimeout(r, 350));
    
    await onSelectBusinessByCr(targetCr.trim());
    setPullProgress(null);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-blue-950/30 to-[#0A0E17] border border-blue-500/20 p-6 space-y-5 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40 uppercase tracking-widest font-bold">
              Multi-Source Ingestion Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Zero Manual File Uploading</span>
          </div>
          <h3 className="font-editorial text-lg lg:text-xl text-white font-medium flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Instant External & Internal Registry Pull</span>
          </h3>
          <p className="text-xs text-slate-400 font-light max-w-xl">
            Input a Commercial Registration (CR) number to automatically pull and cross-reference records 
            across the Ministry of Commerce (MOCI), Central Bank (CiNet), and Warba Bank Core CRM.
          </p>
        </div>

        {/* 4 Connected Systems Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-slate-300 flex items-center gap-1">
            <Landmark className="w-3 h-3 text-emerald-400" /> MOCI Register
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-slate-300 flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" /> CBK CiNet
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-slate-300 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-purple-400" /> Warba Finacle
          </span>
        </div>
      </div>

      {/* Input Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={crInput}
            onChange={(e) => setCrInput(e.target.value)}
            placeholder="Enter Kuwait CR Number (e.g. CR-1149204-KW or 1149204)..."
            className="w-full bg-[#080B12] border border-white/15 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
          />
        </div>

        <button
          onClick={() => handlePull(crInput)}
          disabled={!crInput.trim() || isPulling || !!pullProgress}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
        >
          {pullProgress ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Pulling...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Pull Live Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Pull Progress Indicator */}
      {pullProgress && (
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-500/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-mono text-blue-300">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
              <span>{pullProgress.step}</span>
            </span>
            <span>{pullProgress.percent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${pullProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Presets for Quick 1-Click Demonstration */}
      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-white/[0.06] text-xs">
        <span className="text-[11px] font-mono text-slate-500">Live Pilot Borrowers:</span>
        {presets.map((p) => (
          <button
            key={p.cr}
            onClick={() => {
              setCrInput(p.cr);
              handlePull(p.cr);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-mono flex items-center gap-1.5"
          >
            <span className="text-white font-medium">{p.name}</span>
            <span className="text-slate-500">[{p.cr}]</span>
          </button>
        ))}
      </div>

    </div>
  );
};
