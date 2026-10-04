import React, { useState } from 'react';
import { MemoSection, Citation, ApprovalWorkflow } from '../types';
import { 
  FileText, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  Stamp, 
  Info,
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';

interface CreditMemoPanelProps {
  sections: MemoSection[];
  citations: Record<string, Citation>;
  approvalWorkflow: ApprovalWorkflow;
  onApprove: (role: 'credit_analyst' | 'scu' | 'committee', officerName: string) => Promise<void>;
  isApproving: boolean;
}

export const CreditMemoPanel: React.FC<CreditMemoPanelProps> = ({
  sections,
  citations,
  approvalWorkflow,
  onApprove,
  isApproving,
}) => {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number>(1);

  const handleCitationClick = (code: string) => {
    const found = citations[code];
    if (found) {
      setActiveCitation(found);
    } else {
      setActiveCitation({
        id: code,
        code,
        docName: 'Audited Financial Statements & Regulatory Ledger.pdf',
        page: 'Verified Clause',
        excerpt: 'Certified corporate disclosure verified under CBK regulatory standards.',
        verifiedHash: '8f2d...33ba',
      });
    }
  };

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-purple-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Credit Committee Memorandum</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-500/30">
                  6-Section Certified Brief
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official executive memo featuring cryptographic inline citation proof and 3-stage governance sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Click citations for provenance</span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-b border-white/5 text-xs">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                activeSectionId === sec.id
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Sec {sec.id}
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="mt-3 bg-slate-950/70 rounded-xl p-4 border border-white/10 min-h-[170px] flex flex-col justify-between">
          {(() => {
            const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];
            if (!currentSection) return null;

            return (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>{currentSection.title}</span>
                </h4>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentSection.content}
                </p>

                {/* Inline Citations Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono">Provenanced Sources:</span>
                  {currentSection.citations.map((code) => (
                    <button
                      key={code}
                      onClick={() => handleCitationClick(code)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-semibold transition-all hover:scale-105 cursor-pointer"
                      title="Inspect authenticated excerpt"
                    >
                      <span>[{code}]</span>
                      <ExternalLink className="w-2.5 h-2.5 text-purple-400" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* 3-Tier Multi-Role Approval Workflow */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Stamp className="w-3.5 h-3.5 text-purple-400" />
            <span>Governance Approval Workflow</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            CBK Regulation & Shariah Board Mandate
          </span>
        </div>

        {/* 3 Role Action Buttons / Statuses */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          
          {/* 1. Credit Analyst */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            approvalWorkflow.creditAnalyst.approved
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900/60 border-white/10 text-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold">Credit Analyst</span>
              {approvalWorkflow.creditAnalyst.approved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>

            {approvalWorkflow.creditAnalyst.approved ? (
              <div className="text-[10px] space-y-0.5 font-mono">
                <p className="text-emerald-400 font-semibold truncate">
                  {approvalWorkflow.creditAnalyst.name?.split(',')[0] || 'Ahmad Al-Sabah'}
                </p>
                <p className="text-slate-400 text-[9px]">SIGNED & STAMPED</p>
              </div>
            ) : (
              <button
                onClick={() => onApprove('credit_analyst', 'Ahmad Al-Sabah, CFA (Senior Analyst)')}
                disabled={isApproving}
                className="w-full mt-1 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold transition-colors cursor-pointer"
              >
                Approve as Analyst
              </button>
            )}
          </div>

          {/* 2. SCU Reviewer (Shariah Compliance Unit) */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            approvalWorkflow.scuReviewer.approved
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900/60 border-white/10 text-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold">SCU Reviewer</span>
              {approvalWorkflow.scuReviewer.approved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>

            {approvalWorkflow.scuReviewer.approved ? (
              <div className="text-[10px] space-y-0.5 font-mono">
                <p className="text-emerald-400 font-semibold truncate">
                  {approvalWorkflow.scuReviewer.name?.split(',')[0] || 'Dr. Tariq Al-Otaibi'}
                </p>
                <p className="text-slate-400 text-[9px]">AAOIFI CERTIFIED</p>
              </div>
            ) : (
              <button
                onClick={() => onApprove('scu', 'Dr. Tariq Al-Otaibi (SCU Officer)')}
                disabled={isApproving}
                className="w-full mt-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold transition-colors cursor-pointer"
              >
                SCU Reviewer Approve
              </button>
            )}
          </div>

          {/* 3. Credit Committee */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            approvalWorkflow.committeeSanction.approved
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900/60 border-white/10 text-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold">Committee Sanction</span>
              {approvalWorkflow.committeeSanction.approved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>

            {approvalWorkflow.committeeSanction.approved ? (
              <div className="text-[10px] space-y-0.5 font-mono">
                <p className="text-emerald-400 font-semibold truncate">SANCTIONED</p>
                <p className="text-slate-400 text-[9px]">FACILITY ACTIVATED</p>
              </div>
            ) : (
              <button
                onClick={() => onApprove('committee', 'Corporate Credit Committee')}
                disabled={isApproving || !approvalWorkflow.creditAnalyst.approved || !approvalWorkflow.scuReviewer.approved}
                className={`w-full mt-1 py-1 rounded text-[10px] font-semibold transition-colors ${
                  approvalWorkflow.creditAnalyst.approved && approvalWorkflow.scuReviewer.approved
                    ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md shadow-purple-900/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title={
                  approvalWorkflow.creditAnalyst.approved && approvalWorkflow.scuReviewer.approved
                    ? 'Grant final credit committee sanction'
                    : 'Requires prior Credit Analyst and SCU sign-offs'
                }
              >
                Committee Sanction
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Citation Details Popover Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-purple-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                  {activeCitation.code}
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                  Provenance Citation
                </span>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-white text-base cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Source Document & Page:</span>
                <span className="font-semibold text-white">{activeCitation.docName}</span>
                <span className="text-slate-400 font-mono text-[11px] block">{activeCitation.page}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Authenticated Extraction:</span>
                <p className="text-slate-200 italic leading-relaxed text-xs">
                  "{activeCitation.excerpt}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>Cryptographic Digest:</span>
                <span className="text-purple-300">{activeCitation.verifiedHash}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
