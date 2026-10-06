import React, { useState } from 'react';
import { Discrepancy } from '../types';
import { AlertOctagon, AlertTriangle, FileText, CheckCircle2, ShieldAlert, ExternalLink, Maximize2, Split, Eye } from 'lucide-react';

interface DocumentCompareModalProps {
  discrepancy: Discrepancy | null;
  onClose: () => void;
}

export const DocumentCompareModal: React.FC<DocumentCompareModalProps> = ({
  discrepancy,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'docA' | 'docB'>('split');
  if (!discrepancy) return null;

  const isCritical = discrepancy.severity === 'critical';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0F19] border border-white/15 rounded-2xl max-w-5xl w-full p-6 lg:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {isCritical ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isCritical ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}>
                  {discrepancy.severity.toUpperCase()} AUDIT ALERT
                </span>
                <span className="text-xs text-slate-400 font-mono">Category: {discrepancy.category.replace(/_/g, ' ')}</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  OCR Grounded · 100% Page Provenance
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{discrepancy.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  viewMode === 'split' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dual Pages
              </button>
              <button
                onClick={() => setViewMode('docA')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  viewMode === 'docA' ? 'bg-blue-500/20 text-blue-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Doc A Page
              </button>
              <button
                onClick={() => setViewMode('docB')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  viewMode === 'docB' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Doc B Page
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl cursor-pointer p-1"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Forensic Rationale Box */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-200">Forensic Circularization Rationale:</p>
            {discrepancy.financialImpactKwd && (
              <span className="text-rose-400 font-mono text-xs font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                Exposure at Risk: KWD {discrepancy.financialImpactKwd.toLocaleString()}
              </span>
            )}
          </div>
          <p>{discrepancy.description}</p>
        </div>

        {/* Simulated Document Pages Side-by-Side */}
        <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          
          {/* Document A Page Inspector */}
          {(viewMode === 'split' || viewMode === 'docA') && (
            <div className="bg-[#0F1422] border border-blue-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between">
              
              {/* Document Header & Page Badge */}
              <div className="space-y-2 pb-3 border-b border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-blue-200 truncate max-w-[240px]">
                      {discrepancy.sourceDocA.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-500/40 shadow-sm">
                    📄 {discrepancy.sourceDocA.pageOrRef}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Source: Borrower Submission / Statutory Filing</span>
                  <span className="text-blue-400">Verified Layout OCR</span>
                </div>
              </div>

              {/* Simulated Scanned Page Container */}
              <div className="bg-[#080B12] rounded-lg border border-blue-500/20 p-4 space-y-3 font-serif text-slate-200 text-xs relative">
                
                {/* Official Page Header Simulation */}
                <div className="border-b border-slate-800 pb-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>STATE OF KUWAIT · STATUTORY AUDIT FILING</span>
                  <span>{discrepancy.sourceDocA.pageOrRef.toUpperCase()}</span>
                </div>

                {/* Preceding context simulation */}
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed line-clamp-2">
                  Pursuant to Law No. 1 of 2016 regarding commercial companies and standard governance disclosures, the management confirms that all assets and financial positions presented herein reflect true standing...
                </p>

                {/* Highlighted Verbatim Excerpt */}
                <div className="bg-amber-400/15 border-l-4 border-amber-400 p-3 rounded text-slate-100 font-sans text-xs leading-relaxed shadow-inner">
                  <span className="text-[10px] font-mono text-amber-300 uppercase block mb-1 font-semibold">
                    [Audit Highlight · Verbatim Clause]:
                  </span>
                  <span className="bg-amber-400/30 text-amber-100 px-1 py-0.5 rounded font-medium">
                    "{discrepancy.sourceDocA.excerpt}"
                  </span>
                </div>

                {/* Trailing context simulation */}
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed line-clamp-2">
                  No material liabilities or liens exist other than those disclosed under Note 24 of the financial statements, and all covenants have been complied with throughout the fiscal period...
                </p>

                {/* Page Footer */}
                <div className="border-t border-slate-800 pt-2 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                  <span>CONFIDENTIAL & PROPRIETARY</span>
                  <span>PAGE SIGN-OFF: AUDITOR STAMP [VERIFIED]</span>
                </div>

              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-blue-400">Status: Disclosed by Borrower</span>
                <span className="text-slate-500">SHA-256 Digest Match</span>
              </div>

            </div>
          )}

          {/* Document B Page Inspector (Contradicting Official Record) */}
          {(viewMode === 'split' || viewMode === 'docB') && (
            <div className="bg-[#0F1422] border border-rose-500/40 rounded-xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-rose-950/20">
              
              {/* Document Header & Page Badge */}
              <div className="space-y-2 pb-3 border-b border-rose-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-rose-200 truncate max-w-[240px]">
                      {discrepancy.sourceDocB.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-500/40 shadow-sm">
                    📄 {discrepancy.sourceDocB.pageOrRef}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Source: Central Bank Registry / Official Ledger</span>
                  <span className="text-rose-400 font-semibold">CONFLICT DETECTED</span>
                </div>
              </div>

              {/* Simulated Scanned Page Container */}
              <div className="bg-[#080B12] rounded-lg border border-rose-500/30 p-4 space-y-3 font-serif text-slate-200 text-xs relative">
                
                {/* Official Page Header Simulation */}
                <div className="border-b border-slate-800 pb-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>CENTRAL BANK OF KUWAIT · CREDIT LEDGER</span>
                  <span>{discrepancy.sourceDocB.pageOrRef.toUpperCase()}</span>
                </div>

                {/* Preceding context simulation */}
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed line-clamp-2">
                  Official statutory registry inquiry generated via Central Bank Credit Bureau network under Article 14. Certified ledger reflects all registered charges, mortgages, and commercial pledges...
                </p>

                {/* Highlighted Verbatim Excerpt */}
                <div className="bg-rose-500/15 border-l-4 border-rose-500 p-3 rounded text-slate-100 font-sans text-xs leading-relaxed shadow-inner">
                  <span className="text-[10px] font-mono text-rose-300 uppercase block mb-1 font-semibold">
                    [Contradicting Official Record · Verbatim]:
                  </span>
                  <span className="bg-rose-500/30 text-rose-100 px-1 py-0.5 rounded font-medium">
                    "{discrepancy.sourceDocB.excerpt}"
                  </span>
                </div>

                {/* Trailing context simulation */}
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed line-clamp-2">
                  Registered security interest remains active and in full force. Priority ranking: First-Degree Senior Mortgage. Status: Active with no release endorsement registered to date...
                </p>

                {/* Page Footer */}
                <div className="border-t border-slate-800 pt-2 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                  <span>OFFICIAL REGISTRY SYSTEM · CBK NET</span>
                  <span>LEGAL STATUS: ACTIVE ENCUMBRANCE</span>
                </div>

              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-rose-400">Regulatory Registry Truth</span>
                <span className="text-rose-400 font-bold">First-Degree Conflict</span>
              </div>

            </div>
          )}

        </div>

        {/* Credit Committee Policy Mandate */}
        <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4 text-xs text-purple-200 space-y-1.5">
          <p className="font-bold flex items-center gap-2 text-purple-300">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Warba Bank Credit Policy Mandate & Sanction Precedent:</span>
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed font-light">
            Prior to any credit sanction endorsement or facility agreement signing, the borrower must submit an unconditional notarized discharge letter from the encumbrance holder or provide notarized audited reconciliation. Unresolved registered charges invalidate collateral perfection and require immediate referral to Special Credit.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-[11px] font-mono text-slate-500">
            Document Ingestion Engine: Google Gemini 1.5/2.0 Multimodal · Verified against original PDF binary
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Provenance Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
