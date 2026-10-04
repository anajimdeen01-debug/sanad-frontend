import React from 'react';
import { Discrepancy } from '../types';
import { 
  Radar, 
  AlertOctagon, 
  AlertTriangle, 
  FileWarning, 
  ExternalLink, 
  ArrowRightLeft, 
  ShieldCheck,
  CheckCircle2,
  FileSearch
} from 'lucide-react';

interface DetectiveRadarProps {
  discrepancies: Discrepancy[];
  onOpenCompareModal: (discrepancy: Discrepancy) => void;
}

export const DetectiveRadar: React.FC<DetectiveRadarProps> = ({
  discrepancies,
  onOpenCompareModal,
}) => {
  const criticalCount = discrepancies.filter(d => d.severity === 'critical').length;
  const highCount = discrepancies.filter(d => d.severity === 'high').length;
  const mediumCount = discrepancies.filter(d => d.severity === 'medium').length;

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-rose-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border ${
              criticalCount > 0 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Detective Radar</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                  Cross-Document Forensic Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated multi-pass contradiction scanner across financial audits, registries, and bank ledgers.
              </p>
            </div>
          </div>

          {/* Severity Counters */}
          <div className="flex items-center gap-1.5">
            {criticalCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-400 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>{criticalCount} Critical</span>
              </span>
            )}
            {highCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-400 px-2 py-0.5 rounded">
                {highCount} High
              </span>
            )}
            {criticalCount === 0 && highCount === 0 && (
              <span className="text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero Contradictions</span>
              </span>
            )}
          </div>
        </div>

        {/* Warning Cards List */}
        <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {discrepancies.length === 0 ? (
            <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-8 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">Full Cross-Document Alignment</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No undisclosed liabilities, revenue variances, or encumbrance conflicts discovered across submitted files.
              </p>
            </div>
          ) : (
            discrepancies.map((disc) => {
              const isCritical = disc.severity === 'critical';
              const isHigh = disc.severity === 'high';

              return (
                <div
                  key={disc.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60 shadow-lg shadow-rose-950/20'
                      : isHigh
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {isCritical ? (
                        <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold ${isCritical ? 'text-rose-300' : isHigh ? 'text-amber-300' : 'text-slate-200'}`}>
                            {disc.title}
                          </h4>
                          {disc.financialImpactKwd && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-300 border border-white/10">
                              Impact: KWD {disc.financialImpactKwd.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {disc.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCompareModal(disc)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/25 transition-all cursor-pointer whitespace-nowrap"
                      title="Inspect conflicting excerpts side-by-side"
                    >
                      <ArrowRightLeft className="w-3 h-3 text-purple-400" />
                      <span>Compare</span>
                    </button>
                  </div>

                  {/* Conflicting Source Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/5 text-[10px]">
                    
                    {/* Source Doc A */}
                    <div className="bg-slate-950/70 rounded-lg p-2 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-blue-400 truncate max-w-[130px]">
                          {disc.sourceDocA.name}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">{disc.sourceDocA.pageOrRef}</span>
                      </div>
                      <p className="text-slate-300 italic line-clamp-2 text-[10px]">
                        "{disc.sourceDocA.excerpt}"
                      </p>
                    </div>

                    {/* Source Doc B (Contradicting) */}
                    <div className="bg-slate-950/70 rounded-lg p-2 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-rose-400 truncate max-w-[130px]">
                          {disc.sourceDocB.name}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">{disc.sourceDocB.pageOrRef}</span>
                      </div>
                      <p className="text-slate-300 italic line-clamp-2 text-[10px]">
                        "{disc.sourceDocB.excerpt}"
                      </p>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info / Shariah Legal Impact */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <FileSearch className="w-3.5 h-3.5 text-purple-400" />
          <span>OCR Confidence: 99.4% · Chained to CBK Liens Ledger</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          Standard: CBK Directive 2026/CR
        </span>
      </div>

    </div>
  );
};
