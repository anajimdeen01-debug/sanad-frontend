import React, { useState } from 'react';
import { EvaluationPayload, Business, ApprovalWorkflow } from '../types';
import { apiService } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BarChart3, 
  Calculator, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Stamp,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { CleanFormattedText } from '../utils/cleanText';

interface ChapterAskSanadProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
  approvalWorkflow: ApprovalWorkflow;
  onApprove: (role: 'credit_analyst' | 'scu' | 'committee', officerName: string) => Promise<void>;
  isApproving: boolean;
}

interface AppendedCard {
  id: string;
  query: string;
  timestamp: string;
  answer: string;
  visualType?: 'purification' | 'stress' | 'ratio';
  visualData?: any;
  mathProof?: {
    formula: string;
    steps: string[];
    result: string;
  };
  citationReceipt?: {
    code: string;
    docName: string;
    excerpt: string;
    hash: string;
  };
}

export const ChapterAskSanad: React.FC<ChapterAskSanadProps> = ({
  evaluation,
  selectedBiz,
  approvalWorkflow,
  onApprove,
  isApproving,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [appendedCards, setAppendedCards] = useState<AppendedCard[]>([]);

  const taharah = evaluation.taharah_schedule;
  const financials = evaluation.financial_analytics;
  const scores = evaluation.scores;

  const handleQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsProcessing(true);
    setInputText('');

    try {
      const response = await apiService.askSanad(q, evaluation, selectedBiz);
      
      const newCard: AppendedCard = {
        id: `card_${Date.now()}`,
        query: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answer: response.answer,
        visualType: response.visualType || 'ratio',
        visualData: response.visualData || {
          score: scores.score,
          dscr: financials.baselineDscr,
          ltv: financials.ltvRatioPct,
        },
        mathProof: response.mathProof,
        citationReceipt: {
          code: 'SANAD-AUTONOMOUS-AI§1',
          docName: `${selectedBiz.name} Credit Assessment (CR #${selectedBiz.cr_number})`,
          excerpt: `Dynamic underwriter synthesis: Score ${scores.score}/100 (${scores.status}), DSCR ${financials.baselineDscr}x, LTV ${financials.ltvRatioPct}%.`,
          hash: evaluation.sha256Fingerprint.substring(0, 16) + '...',
        },
      };

      setAppendedCards(prev => [newCard, ...prev]);
    } catch (err) {
      console.error('Ask Sanad query error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const presetChips = [
    { label: '⚖️ Credit Sanction Verdict', q: 'With all these findings, should they be considered for the loan?' },
    { label: '💰 Explain Taharah Math', q: `Explain the ${taharah.taharahPurificationDueKwd.toLocaleString()} KWD purification requirement` },
    { label: '📉 Simulate -25% Severe Shock', q: 'Simulate 25% revenue drop and CBK rate hike' },
    { label: '🔍 Audit Registry Discrepancies', q: 'Audit cross-document discrepancies and undisclosed liabilities' },
  ];

  return (
    <article className="py-12 space-y-8">
      
      {/* Chapter Number & Heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            Chapter 05
          </span>
          <span className="h-px w-8 bg-slate-800" />
          <span className="text-xs font-mono text-purple-400/90">
            Conversational Reasoning & Governance Sanction
          </span>
        </div>
        <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
          Interactive Analytical Inquiry & Governance
        </h2>
      </div>

      <div className="space-y-6">
        
        {/* Persistent Inquiry Input Box ("Ask Sanad") */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2 text-purple-400">
              <Bot className="w-4 h-4" />
              <span className="text-white font-semibold">Ask Sanad Living Analytical Core</span>
            </span>
            <span>Mathematical Proofs & Citations</span>
          </div>

          {/* Preset Prompts Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-mono text-[10px] shrink-0">Fast Prompts:</span>
            {presetChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuery(chip.q)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/[0.03] hover:bg-purple-950/60 text-slate-300 hover:text-purple-300 border border-white/[0.06] hover:border-purple-500/30 transition-colors cursor-pointer text-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Inquiry Input Bar */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Ask Sanad to simulate extreme liquidity shocks, draft an SCU inquiry, or extract supplier concentrations..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery(inputText)}
              className="flex-1 bg-[#090D16] border border-white/[0.08] focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
            <button
              onClick={() => handleQuery(inputText)}
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {isProcessing ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Dynamic Appended Cards (Written Directly into Living Dossier) */}
        {appendedCards.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Appended Analytical Insights ({appendedCards.length})</span>
              <span className="text-purple-400">Live Synthesis</span>
            </div>

            {appendedCards.map(card => (
              <div
                key={card.id}
                className="rounded-2xl bg-white/[0.02] border border-purple-500/25 p-6 lg:p-8 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-mono text-purple-300 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Inquiry: "{card.query}"</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{card.timestamp}</span>
                </div>

                <CleanFormattedText 
                  text={card.answer}
                  className="text-sm text-slate-200 leading-relaxed font-light"
                />

                {/* Visual Micro-Chart */}
                {card.visualType === 'purification' && (
                  <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Permissible Operating Cash:</span>
                      <span className="text-emerald-400 font-bold">KWD {card.visualData.permissible.toLocaleString()} (99.95%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '99.5%' }} />
                      <div className="bg-amber-400 h-full animate-pulse" style={{ width: '0.5%' }} />
                    </div>
                    <div className="flex justify-between text-xs font-mono pt-1 text-amber-400">
                      <span>Purification Due:</span>
                      <span>KWD {card.visualData.prohibited.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {card.visualType === 'stress' && (
                  <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Baseline DSCR:</span>
                      <span className="text-white font-bold">{card.visualData.baseline}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stressed DSCR:</span>
                      <span className={`font-bold ${card.visualData.pass ? 'text-teal-400' : 'text-rose-400'}`}>
                        {card.visualData.stressed}x
                      </span>
                    </div>
                  </div>
                )}

                {/* Mathematical Proof Box */}
                {card.mathProof && (
                  <div className="p-4 rounded-xl bg-[#090D16] border border-purple-500/20 font-mono text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-purple-400 text-[10px] uppercase font-bold">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Mathematical Verification Proof</span>
                    </div>
                    <p className="text-white font-semibold">{card.mathProof.formula}</p>
                    <div className="space-y-0.5 text-slate-400 text-[11px]">
                      {card.mathProof.steps.map((st, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-purple-400">›</span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] text-emerald-400 font-bold">
                      {card.mathProof.result}
                    </div>
                  </div>
                )}

                {/* Citation Receipt */}
                {card.citationReceipt && (
                  <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between text-purple-300 font-mono text-[11px]">
                      <span className="font-semibold">Receipt [{card.citationReceipt.code}]</span>
                      <span className="text-slate-400">{card.citationReceipt.hash}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-medium">{card.citationReceipt.docName}</p>
                    <p className="text-slate-200 italic text-[11px]">"{card.citationReceipt.excerpt}"</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

        {/* 3-Tier Multi-Role Governance Sign-Off Bar */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 lg:p-8 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Stamp className="w-4 h-4 text-purple-400" />
              <h3 className="font-editorial text-lg text-white font-medium">
                Governance Sanction & Multi-Role Sign-Off
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Mandatory Shariah & Credit Perfected Ledger
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Role 1: Credit Analyst */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Credit Analyst</span>
                {approvalWorkflow.creditAnalyst.approved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {approvalWorkflow.creditAnalyst.approved ? (
                <div className="text-xs font-mono space-y-0.5 pt-1">
                  <p className="text-emerald-400 font-medium truncate">{approvalWorkflow.creditAnalyst.name?.split(',')[0]}</p>
                  <p className="text-slate-400 text-[10px]">Validated & Stamped</p>
                </div>
              ) : (
                <button
                  onClick={() => onApprove('credit_analyst', 'Ahmad Al-Sabah, CFA (Senior Analyst)')}
                  disabled={isApproving}
                  className="w-full mt-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold transition-colors cursor-pointer border border-white/10"
                >
                  Sign as Analyst
                </button>
              )}
            </div>

            {/* Role 2: SCU Reviewer */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">SCU Officer</span>
                {approvalWorkflow.scuReviewer.approved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {approvalWorkflow.scuReviewer.approved ? (
                <div className="text-xs font-mono space-y-0.5 pt-1">
                  <p className="text-emerald-400 font-medium truncate">{approvalWorkflow.scuReviewer.name?.split(',')[0]}</p>
                  <p className="text-slate-400 text-[10px]">AAOIFI Certified</p>
                </div>
              ) : (
                <button
                  onClick={() => onApprove('scu', 'Dr. Tariq Al-Otaibi (SCU Officer)')}
                  disabled={isApproving}
                  className="w-full mt-2 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer border border-emerald-500/30"
                >
                  Sign as SCU Officer
                </button>
              )}
            </div>

            {/* Role 3: Committee Sanction */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Committee Sanction</span>
                {approvalWorkflow.committeeSanction.approved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {approvalWorkflow.committeeSanction.approved ? (
                <div className="text-xs font-mono space-y-0.5 pt-1">
                  <p className="text-emerald-400 font-medium truncate">Facility Sanctioned</p>
                  <p className="text-slate-400 text-[10px]">Active Line</p>
                </div>
              ) : (
                <button
                  onClick={() => onApprove('committee', 'Corporate Credit Committee')}
                  disabled={isApproving || !approvalWorkflow.creditAnalyst.approved || !approvalWorkflow.scuReviewer.approved}
                  className={`w-full mt-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    approvalWorkflow.creditAnalyst.approved && approvalWorkflow.scuReviewer.approved
                      ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md'
                      : 'bg-white/[0.02] text-slate-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Sanction Facility
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </article>
  );
};
