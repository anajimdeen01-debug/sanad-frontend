import React, { useState } from 'react';
import { Business } from '../types';
import { 
  Building2, 
  FileDown, 
  Upload, 
  ChevronDown, 
  Plus, 
  RefreshCw,
  FolderOpen,
  Languages
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ExecutiveTopBarProps {
  businesses: Business[];
  selectedBiz: Business | null;
  onSelectBiz: (biz: Business) => void;
  onOpenNewBorrowerModal: () => void;
  onOpenUploadModal: () => void;
  onOpenAuditModal: () => void;
  onExportMemo: () => void;
  onRefreshBackend: () => void;
  sha256Hash: string;
  isBackendLive: boolean;
  lang: Language;
  onToggleLang: () => void;
}

export const ExecutiveTopBar: React.FC<ExecutiveTopBarProps> = ({
  businesses,
  selectedBiz,
  onSelectBiz,
  onOpenNewBorrowerModal,
  onOpenUploadModal,
  onOpenAuditModal,
  onExportMemo,
  onRefreshBackend,
  sha256Hash,
  isBackendLive,
  lang,
  onToggleLang,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = translations[lang];

  const truncatedHash = `${sha256Hash.substring(0, 8)}...${sha256Hash.substring(sha256Hash.length - 6)}`;

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/95 backdrop-blur-xl border-b border-white/[0.06] transition-colors">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: Warba Bank & Sanad Mark + Dynamic Workspace Selector */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex items-center gap-3">
            {/* Subtle Metallic Monogram */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#090D16] rounded-[7px] flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-xs tracking-wider">WB</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-lg tracking-tight text-[#F8FAFC] font-semibold">
                {lang === 'ar' ? 'سند' : 'Sanad'}
              </span>
              <span className="font-arabic text-xs text-emerald-400/90 font-medium">
                {lang === 'ar' ? 'Sanad' : 'سند'}
              </span>
              <span className="text-[11px] text-slate-500 font-light tracking-wide uppercase ml-1 hidden sm:inline">
                {t.brandSubtitle}
              </span>
            </div>
          </div>

          <span className="text-slate-700 hidden md:inline">/</span>

          {/* DYNAMIC WORKSPACE SELECTOR */}
          <div className="relative">
            {businesses.length === 0 ? (
              <button
                onClick={onOpenNewBorrowerModal}
                className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors py-1 px-2.5 rounded-md bg-emerald-950/30 border border-emerald-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.registerBorrower}</span>
              </button>
            ) : (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer py-1 px-2.5 rounded-lg border border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-medium text-slate-200 truncate max-w-[180px] sm:max-w-[240px]">
                  {selectedBiz ? (lang === 'ar' && selectedBiz.nameArabic ? selectedBiz.nameArabic : selectedBiz.name) : t.selectWorkspace}
                </span>
                {selectedBiz && (
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    ({selectedBiz.cr_number})
                  </span>
                )}
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            )}

            {dropdownOpen && businesses.length > 0 && (
              <div 
                className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} mt-2 w-80 bg-[#0E1322] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden`}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/5 font-mono flex items-center justify-between">
                  <span>{t.activeBorrowers} ({businesses.length})</span>
                  <button
                    onClick={onRefreshBackend}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.04]">
                  {businesses.map((biz) => {
                    const isSelected = selectedBiz?.id === biz.id;
                    const displayName = lang === 'ar' && biz.nameArabic ? biz.nameArabic : biz.name;
                    return (
                      <button
                        key={biz.id}
                        onClick={() => {
                          onSelectBiz(biz);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 hover:bg-white/[0.04] transition-colors flex items-center justify-between text-xs cursor-pointer ${
                          isSelected ? 'bg-emerald-950/30 text-emerald-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-medium truncate text-white">{displayName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">CR: {biz.cr_number} · {biz.sector}</p>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-400 bg-slate-900 border border-white/5">
                          {biz.riskRating || 'Active'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewBorrowerModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 rounded bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.registerBorrower}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions and Language Toggle */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          
          {/* Tamper-Proof Cryptographic Trust Seal */}
          {selectedBiz && (
            <div 
              onClick={onOpenAuditModal}
              className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer transition-colors group"
              title="Inspect SHA-256 Chained Integrity Log"
            >
              <span className="text-slate-500">SHA-256:</span>
              <span className="text-slate-300 group-hover:text-emerald-300 transition-colors">
                {truncatedHash}
              </span>
              <span className="text-[10px] text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-1 rounded">
                {t.verifiedBadge}
              </span>
            </div>
          )}

          {/* Language Switcher Button (EN / العربية) */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            title={lang === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span className={lang === 'ar' ? 'font-sans font-bold' : 'font-arabic font-bold'}>
              {lang === 'en' ? 'العربية' : 'English'}
            </span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Add New Borrower Button */}
          <button
            onClick={onOpenNewBorrowerModal}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.registerBorrower}</span>
          </button>

          {/* Upload Dossier Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.uploadDossier}</span>
          </button>

          {/* Export Memorandum */}
          <button
            onClick={onExportMemo}
            disabled={!selectedBiz}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 disabled:opacity-40 px-3.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 transition-all cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{t.downloadMemo}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
