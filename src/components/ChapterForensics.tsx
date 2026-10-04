import React, { useState } from 'react';
import { Discrepancy } from '../types';
import { AlertOctagon, AlertTriangle, ShieldCheck, FileText, CheckCircle2, Split } from 'lucide-react';

interface ChapterForensicsProps {
  discrepancies: Discrepancy[];
}

export const ChapterForensics: React.FC<ChapterForensicsProps> = ({
  discrepancies,
}) => {
  const [selectedDiscIndex, setSelectedDiscIndex] = useState<number>(0);

  const activeDisc = discrepancies[selectedDiscIndex] || discrepancies[0];
  const isCritical = activeDisc?.severity === 'critical';

  return (
    <article className="py-12 border-b border-white/[0.06] space-y-8">
      
      {/* Chapter Number & Heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            Chapter 03
          </span>
          <span className="h-px w-8 bg-slate-800" />
          <span className="text-xs font-mono text-rose-400/90">
            Cross-Document Optical & Legal Forensic Audit
          </span>
        </div>
        <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
          Forensic Cross-Document Detective Findings
        </h2>
      </div>

      <div className="space-y-6">
        
        {/* Editorial Introduction */}
        <p className="text-sm text-slate-300 leading-relaxed font-light max-w-3xl">
          Sanad continuously circularizes facts across uploaded files, cross-referencing company declarations 
          against the Ministry of Commerce & Industry (MOCI) Commercial Register, the Central Bank of Kuwait (CBK) Credit Bureau (Ci-Net) database, 
          and audited income statements to detect unrecorded debentures, secret pledges, or revenue inflation.
        </p>

        {discrepancies.length === 0 ? (
          /* Clean Reconciled State */
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-emerald-500/20 text-center space-y-3 max-w-2xl mx-auto">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-editorial text-xl text-white">Full Cross-Document Alignment</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Autonomous verification cross-checked 14 submitted corporate filings, bank statements, and registry filings. 
              Zero undisclosed commercial mortgages, unrecorded lease commitments, or top-line variances were detected. 
              Collateral title deeds are authenticated as first-degree unencumbered charges.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CBK Registry & MOCI Match 100% Verified</span>
            </div>
          </div>
        ) : (
          /* Side-by-Side Evidence Diff */
          <div className="space-y-4">
            
            {/* If multiple discrepancies, show selector tabs */}
            {discrepancies.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {discrepancies.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiscIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                      selectedDiscIndex === idx
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                        : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    Note 0{idx + 1}: {d.severity.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Evidence Diff Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 lg:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isCritical ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40' : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'}`}>
                    {isCritical ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Discrepancy Category: {activeDisc.category}
                    </span>
                    <h3 className="font-editorial text-lg text-white font-medium">
                      {activeDisc.title}
                    </h3>
                  </div>
                </div>

                {activeDisc.financialImpactKwd && (
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
                    Unreconciled Exposure: KWD {activeDisc.financialImpactKwd.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Analysis Prose */}
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {activeDisc.description}
              </p>

              {/* Clean Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Column 1: Document A (The Claim) */}
                <div className="p-4 rounded-xl bg-[#090D16] border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-mono pb-2 border-b border-white/[0.06]">
                    <span className="font-semibold truncate max-w-[200px]">{activeDisc.sourceDocA.name}</span>
                    <span className="text-slate-400">{activeDisc.sourceDocA.pageOrRef}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono text-[10px] uppercase">Borrower Declaration Clause:</p>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{activeDisc.sourceDocA.excerpt}"
                  </p>
                </div>

                {/* Column 2: Document B (The Contradiction) */}
                <div className="p-4 rounded-xl bg-[#090D16] border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-rose-400 font-mono pb-2 border-b border-white/[0.06]">
                    <span className="font-semibold truncate max-w-[200px]">{activeDisc.sourceDocB.name}</span>
                    <span className="text-slate-400">{activeDisc.sourceDocB.pageOrRef}</span>
                  </div>
                  <p className="text-xs text-rose-400 font-mono text-[10px] uppercase font-semibold">Contradicting Official Record:</p>
                  <p className="text-xs text-rose-200 italic leading-relaxed">
                    "{activeDisc.sourceDocB.excerpt}"
                  </p>
                </div>

              </div>

              {/* Credit Committee Policy Mandate */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                <span className="font-mono font-semibold text-purple-300 block uppercase text-[10px]">
                  Warba Bank Committee Condition Precedent:
                </span>
                <p className="text-slate-300 leading-relaxed font-light">
                  Prior to any facility documentation or disbursement, borrower must furnish an unconditional mortgage discharge certificate from the creditor bank and notarized registration cancellation from the Ministry of Justice.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </article>
  );
};
