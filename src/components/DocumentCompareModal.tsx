import React from 'react';
import { Discrepancy } from '../types';
import { AlertOctagon, AlertTriangle, ArrowRightLeft, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DocumentCompareModalProps {
  discrepancy: Discrepancy | null;
  onClose: () => void;
}

export const DocumentCompareModal: React.FC<DocumentCompareModalProps> = ({
  discrepancy,
  onClose,
}) => {
  if (!discrepancy) return null;

  const isCritical = discrepancy.severity === 'critical';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-white/15 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {isCritical ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isCritical ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}>
                  {discrepancy.severity.toUpperCase()} ALERT
                </span>
                <span className="text-xs text-slate-400 font-mono">Category: {discrepancy.category}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{discrepancy.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Forensic Description */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-200 mb-1">Forensic Analysis Summary:</p>
          <p>{discrepancy.description}</p>
          {discrepancy.financialImpactKwd && (
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 text-rose-400 font-mono text-xs">
              <span className="font-bold">Total Undisclosed / Variance Exposure:</span>
              <span>KWD {discrepancy.financialImpactKwd.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Document A */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300 truncate max-w-[200px]">
                  {discrepancy.sourceDocA.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                {discrepancy.sourceDocA.pageOrRef}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">Primary Claim / Declaration:</p>
            <div className="bg-slate-950 p-3 rounded-lg border border-blue-500/20 text-xs text-slate-200 italic leading-relaxed">
              "{discrepancy.sourceDocA.excerpt}"
            </div>
            <div className="text-[10px] text-blue-400 flex items-center gap-1">
              <span>Status: Declared by Borrower / Auditor</span>
            </div>
          </div>

          {/* Document B (The Contradiction) */}
          <div className="bg-slate-900/80 border border-rose-500/40 rounded-xl p-4 space-y-2 shadow-lg shadow-rose-950/20">
            <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-rose-300 truncate max-w-[200px]">
                  {discrepancy.sourceDocB.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                {discrepancy.sourceDocB.pageOrRef}
              </span>
            </div>

            <p className="text-[11px] text-rose-400 font-mono font-semibold">Contradicting Forensic Evidence:</p>
            <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/30 text-xs text-rose-200 italic leading-relaxed bg-rose-950/10">
              "{discrepancy.sourceDocB.excerpt}"
            </div>
            <div className="text-[10px] text-rose-400 flex items-center gap-1">
              <span>Status: Cross-Verified Regulatory Ledger Conflict</span>
            </div>
          </div>

        </div>

        {/* Credit Committee Directive */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-purple-300">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Warba Bank Credit Policy Mandate:</span>
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Prior to any credit sanction endorsement, the borrower must submit a formal discharge letter from the encumbrance holder or provide notarized audited reconciliation. Unresolved first-loss charges invalidate collateral perfection.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
