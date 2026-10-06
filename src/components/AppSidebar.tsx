/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Radar, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Building2,
  FolderOpen
} from 'lucide-react';
import { Business } from '../types';

interface AppSidebarProps {
  activeTab: 'workspace' | 'report' | 'copilot' | 'radar';
  setActiveTab: (tab: 'workspace' | 'report' | 'copilot' | 'radar') => void;
  businesses: Business[];
  selectedBiz: Business | null;
  onSelectBiz: (biz: Business | null) => void;
  onOpenUpload: () => void;
  lang?: 'en' | 'ar';
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  setActiveTab,
  businesses,
  selectedBiz,
  onSelectBiz,
  onOpenUpload,
}) => {
  return (
    <aside className="w-64 min-w-[16rem] bg-[#071326] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 select-none text-slate-300 font-sans z-40">
      {/* Top Brand Header */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-lg">
              <span className="tracking-tight">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold tracking-wider text-base">SANAD</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded">WB</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide uppercase font-medium">Forensic Intelligence</p>
            </div>
          </div>
        </div>

        {/* Borrower Context Switcher */}
        <div className="px-3 pt-4 pb-2">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1.5 flex items-center justify-between">
            <span>Dossier Context</span>
            <span className="text-[9px] bg-slate-800 text-slate-300 px-1 rounded">Kuwait CBK</span>
          </div>
          <div className="relative">
            <select
              value={selectedBiz?.id || ''}
              onChange={(e) => {
                const found = businesses.find(b => b.id === e.target.value) || null;
                onSelectBiz(found);
              }}
              className="w-full bg-[#0d1e38] hover:bg-[#112443] text-slate-200 text-xs font-medium rounded-lg px-2.5 py-2 border border-slate-700/60 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer truncate appearance-none pr-7"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#071326] text-white">
                  {b.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▾
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-3">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-2">
            Main Menu
          </div>
          <nav className="space-y-1">
            {/* 1. Document Workspace (Intake & OCR) */}
            <button
              onClick={() => setActiveTab('workspace')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'workspace'
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderOpen className={`w-4 h-4 ${activeTab === 'workspace' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>Dashboard / Intake</span>
              </div>
              {activeTab === 'workspace' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>

            {/* 2. Sanad Forensic Report (The Exact AI Explanation Memo from Image 4/5) */}
            <button
              onClick={() => setActiveTab('report')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-emerald-500/20 text-white border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`w-4 h-4 ${activeTab === 'report' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <div className="flex items-center gap-1.5">
                  <span>Forensic Report</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1 rounded">AI</span>
                </div>
              </div>
              {activeTab === 'report' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>

            {/* 3. AI Assistant / Copilot (Image 2) */}
            <button
              onClick={() => setActiveTab('copilot')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'copilot'
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`w-4 h-4 ${activeTab === 'copilot' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>AI Assistant / Inquiry</span>
              </div>
              {activeTab === 'copilot' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>

            {/* 4. RM Radar (Image 3) */}
            <button
              onClick={() => setActiveTab('radar')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'radar'
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radar className={`w-4 h-4 ${activeTab === 'radar' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>RM Radar</span>
              </div>
              {activeTab === 'radar' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Account & System Area */}
      <div className="p-3 border-t border-slate-800/60 bg-[#050e1c]/50 space-y-3">
        <button
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <span>+ Ingest Dossier</span>
        </button>

        {/* User Card matching UX Pilot screenshot */}
        <div className="p-2.5 rounded-xl bg-[#09172e] border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-emerald-500/40">
              NH
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Nasser Hassan</p>
              <p className="text-[10px] text-slate-400 truncate">Senior Credit Analyst</p>
            </div>
          </div>
          <div className="flex items-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
          <span>Warba Core v4.2</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
