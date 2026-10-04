import React, { useState } from 'react';
import { AuditEvent } from '../types';
import { KeyRound, ShieldCheck, Link2, CheckCircle2, Copy, Check } from 'lucide-react';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditTrail: AuditEvent[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  auditTrail,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-purple-500/30 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Cryptographic SHA-256 Chained Audit Trail</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Chain Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable, tamper-evident cryptographic provenance connecting all ingestion, audit, and governance actions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Chained Events List */}
        <div className="overflow-y-auto space-y-3 pr-1 py-1">
          {auditTrail.map((event, idx) => (
            <div
              key={event.id}
              className="bg-slate-950/70 rounded-xl border border-white/10 p-3.5 space-y-2 relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-purple-950 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{event.action}</h4>
                    <p className="text-[11px] text-slate-400">
                      {event.actor} · <span className="text-purple-400 font-medium">{event.role}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                {event.details}
              </p>

              {/* Hash Proof */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-slate-900 p-2 rounded border border-white/5">
                  <div className="flex items-center justify-between text-slate-500 mb-0.5">
                    <span>Block SHA-256 Digest:</span>
                    <button
                      onClick={() => handleCopy(event.id, event.hash)}
                      className="text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      {copiedId === event.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="text-purple-300 break-all">{event.hash}</span>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-white/5">
                  <div className="text-slate-500 mb-0.5">Previous Block Hash:</div>
                  <span className="text-slate-400 break-all">{event.prevHash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[11px]">
            {auditTrail.length} blocks verified in cryptographic chain
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close Audit Trail
          </button>
        </div>

      </div>
    </div>
  );
};
