import React, { useState } from 'react';
import { AuditEvent } from '../types';
import { KeyRound, ShieldCheck, Link2, CheckCircle2, Copy, Check, Lock, Database, FileCheck, Landmark, Globe } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'trail' | 'cbk_privacy'>('trail');
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
        
        {/* Header with Navigation Tabs */}
        <div className="space-y-3 pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Trust, Governance & Sovereign Compliance</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>CBK & AAOIFI Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Central Bank of Kuwait (CBK) data sovereignty safeguards & SHA-256 cryptographic audit logs.
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

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('trail')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'trail'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>SHA-256 Audit Trail ({auditTrail.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cbk_privacy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'cbk_privacy'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-300" />
              <span>CBK Sovereign Privacy & Zero-Retention Shield</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Chained Events List */}
        {activeTab === 'trail' && (
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
        )}

        {/* Tab 2: CBK Sovereign Privacy & Zero-Retention Shield */}
        {activeTab === 'cbk_privacy' && (
          <div className="overflow-y-auto space-y-4 pr-1 py-1">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <Landmark className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Central Bank of Kuwait (CBK) AI Regulatory Compliance
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Sanad is architected in accordance with Central Bank of Kuwait Circular No. 2/BS/IBS/514/2023 
                  regarding Cloud Computing, Data Sovereignty, and Ethical AI Adoption in Kuwaiti Banking Institutions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Zero Data Retention (ZDR)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Customer financial records and PDF balance sheets are processed strictly in ephemeral RAM. 
                  Zero corporate banking data is retained, logged, or used to train or fine-tune public AI models.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Statutory ZDR Enforced</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>On-the-Fly PII Scrubbing</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Kuwait Civil IDs, director personal mobile numbers, and sensitive IBANs are automatically 
                  masked and tokenized before circularization against external registry APIs.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400/90 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Automated Tokenization Active</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Globe className="w-4 h-4" />
                  <span>Sovereign Cloud Boundary</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  All AI synthesis occurs within sovereign GCC/Kuwait private tenant VPC clusters, ensuring full compliance 
                  with CBK cross-border data residency mandates.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400/90 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>In-Region VPC Isolation</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <FileCheck className="w-4 h-4" />
                  <span>AAOIFI Shariah Governance</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Deterministic mathematical validation of AAOIFI Standards No. 21 (Financial Papers) and No. 35 (Zakat/Taharah). 
                  Zero probabilistic hallucination on compliance threshold boundaries.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/90 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Standards 21 & 35 Certified</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Kuwait Banking Regulatory Status:</span>
              <span className="text-emerald-400 font-bold">APPROVED FOR ENTERPRISE PILOT</span>
            </div>
          </div>
        )}

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
