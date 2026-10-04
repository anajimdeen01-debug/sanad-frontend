import React, { useState } from 'react';
import { Business } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  FileDown, 
  Plus, 
  ChevronDown, 
  History, 
  Wifi, 
  Server
} from 'lucide-react';

interface NavbarProps {
  businesses: Business[];
  selectedBiz: Business | null;
  onSelectBiz: (biz: Business) => void;
  onOpenNewBorrowerModal: () => void;
  onOpenAuditModal: () => void;
  onOpenBackendModal: () => void;
  onExportMemo: () => void;
  isBackendLive: boolean;
  apiUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  businesses,
  selectedBiz,
  onSelectBiz,
  onOpenNewBorrowerModal,
  onOpenAuditModal,
  onOpenBackendModal,
  onExportMemo,
  isBackendLive,
  apiUrl,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Warba Bank & Sanad Brand Lockup */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Geometric Warba Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/10" />
                <span className="text-emerald-400 font-bold text-lg tracking-wider">WB</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">SANAD</span>
                <span className="text-sm font-semibold text-emerald-400 font-arabic px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                  سَنَد
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">· Warba Bank</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Track 1: AI Corporate Banking Engine & Shariah Compliance Core
              </p>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-6 w-px bg-white/10 hidden md:block" />

          {/* Live Status Pill */}
          <button
            onClick={onOpenBackendModal}
            title={`API: ${apiUrl} (${isBackendLive ? 'Connected' : 'Autonomous Engine Active'})`}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-[11px] text-slate-300 hover:border-emerald-500/40 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBackendLive ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendLive ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
            </span>
            <span className="font-mono text-emerald-400 font-medium">
              {isBackendLive ? 'FastAPI Online' : 'Autonomous Engine'}
            </span>
            <span className="text-slate-500">·</span>
            <span>Gemini Core</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-mono">AAOIFI 2026.1</span>
          </button>
        </div>

        {/* Center / Right: Borrower Selector & Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Active Borrower Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-100 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left max-w-[140px] sm:max-w-[220px] truncate">
                <span className="block truncate font-semibold">
                  {selectedBiz ? selectedBiz.name : 'Select Borrower'}
                </span>
                <span className="block text-[10px] text-slate-400 truncate font-mono">
                  {selectedBiz ? `CR: ${selectedBiz.cr_number}` : 'No borrower selected'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-[#0F172A] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  <span>Corporate Borrowers ({businesses.length})</span>
                  <span className="text-emerald-400 font-mono">Active Dossiers</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {businesses.map((biz) => {
                    const isSelected = selectedBiz?.id === biz.id;
                    return (
                      <button
                        key={biz.id}
                        onClick={() => {
                          onSelectBiz(biz);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 hover:bg-slate-800/80 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected ? 'bg-emerald-950/40 border-l-2 border-emerald-400' : ''
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-100 truncate">{biz.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{biz.sector}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">CR: {biz.cr_number}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            biz.riskRating === 'A+' || biz.riskRating === 'A'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                              : biz.riskRating === 'BBB'
                              ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-900/60 text-rose-300 border border-rose-500/30'
                          }`}>
                            {biz.riskRating}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-white/10 bg-slate-900/50">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewBorrowerModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Register New Corporate Borrower</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Borrower Modal Button */}
          <button
            onClick={onOpenNewBorrowerModal}
            title="Create New Borrower Dossier"
            className="flex items-center gap-1.5 bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">New Borrower</span>
          </button>

          {/* Audit Chain Button */}
          <button
            onClick={onOpenAuditModal}
            title="Inspect Cryptographic SHA-256 Tamper-Evident Audit Trail"
            className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/50 text-purple-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline font-mono">Audit Chain</span>
          </button>

          {/* Export Credit Memo */}
          <button
            onClick={onExportMemo}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span className="whitespace-nowrap">Export Committee Memo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
