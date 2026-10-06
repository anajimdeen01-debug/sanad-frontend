/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  History, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  Lock, 
  Clock, 
  ArrowRight,
  TrendingDown,
  Download,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { Business, EvaluationPayload } from '../types';

interface InteractiveInquiryViewProps {
  business: Business | null;
  evaluation: EvaluationPayload | null;
  showToast?: (msg: string) => void;
}

export const InteractiveInquiryView: React.FC<InteractiveInquiryViewProps> = ({
  business,
  evaluation,
  showToast,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; hasProof?: boolean }>>([
    {
      role: 'ai',
      text: `Analytical core online. How can I assist with the ${business?.name || 'Gulf Pearl Foods'} dossier today?`,
    },
    {
      role: 'user',
      text: 'Simulate a -25% severe cash flow shock on the current facility and check DSCR headroom.',
    },
    {
      role: 'ai',
      text: 'Applying a 25% shock to EBITDA (KWD 3.45M → KWD 2.58M) while maintaining current debt obligations results in a DSCR of 3.80x. This remains significantly above the 1.25x covenant floor, indicating robust structural headroom despite severe top-line volatility.',
      hasProof: true,
    },
  ]);

  const [creditSigned, setCreditSigned] = useState(true);
  const [scuApproved, setScuApproved] = useState(false);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal;
    setInputVal('');
    setMessages(prev => [
      ...prev,
      { role: 'user', text: userText },
      {
        role: 'ai',
        text: `Underwriting inquiry processed for ${business?.name || 'Gulf Pearl Foods'}: Cross-checked against CBK regulatory ratios and Warba internal credit criteria. Telemetry status verified.`,
      },
    ]);
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessages(prev => [
      ...prev,
      { role: 'user', text: promptText },
      {
        role: 'ai',
        text: `Forensic audit response: Evaluated under AAOIFI standard frameworks. All parameters match the central memorandum findings.`,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#070c16] text-slate-200 font-sans p-6 sm:p-8 flex flex-col justify-between">
      {/* Header matching Image 2 */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Interactive Analytical Inquiry
            </h1>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded">
              CHAPTER 05
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-1.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 ring-2 ring-[#070c16] flex items-center justify-center text-[10px] text-white font-bold">
                TA
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 ring-2 ring-[#070c16] flex items-center justify-center text-[10px] text-white font-bold">
                NH
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-700 ring-2 ring-[#070c16] flex items-center justify-center text-[10px] text-slate-300 font-semibold">
                +2
              </div>
            </div>

            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="max-w-4xl mx-auto py-6 space-y-6">
          {/* AI Intro Message with Quick Action Chips */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-4 shadow-lg inline-block text-xs text-slate-200">
                <p>Analytical core online. How can I assist with the {business?.name || 'Gulf Pearl Foods'} dossier today?</p>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleQuickPrompt('Summarize the credit and Shariah verdict for this borrower.')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1728] hover:bg-[#122036] border border-slate-700/80 text-left transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <p className="text-[9px] font-mono text-slate-400 uppercase font-semibold">VERDICT</p>
                    <p className="text-xs font-semibold text-white">Summarize Verdict</p>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickPrompt('Explain the exact AAOIFI math for the Taharah purification.')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1728] hover:bg-[#122036] border border-slate-700/80 text-left transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <p className="text-[9px] font-mono text-slate-400 uppercase font-semibold">TAHARAH</p>
                    <p className="text-xs font-semibold text-white">Explain Math</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end">
            <div className="flex items-end gap-2.5 max-w-xl">
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm p-3.5 text-xs font-medium shadow-md shadow-blue-600/20">
                Simulate a -25% severe cash flow shock on the current facility and check DSCR headroom.
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 ring-2 ring-emerald-500/40 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                NH
              </div>
            </div>
          </div>

          {/* AI Response with Proof Card */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>

            <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex-1 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <h3 className="text-xs font-bold text-white tracking-wide">
                  Liquidity Stress Simulation
                </h3>
                <span className="text-[9px] font-mono font-semibold text-slate-400 tracking-wider uppercase">
                  MATHEMATICAL PROOF & CITATIONS
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Applying a 25% shock to EBITDA (KWD 3.45M → KWD 2.58M) while maintaining current debt obligations results in a{' '}
                <strong className="text-white font-bold">DSCR of 3.80x</strong>. This remains significantly above the{' '}
                <span className="text-blue-400 font-semibold underline underline-offset-2">1.25x covenant floor</span>, indicating robust structural headroom despite severe top-line volatility.
              </p>

              {/* Mathematical Proof Card matching screenshot */}
              <div className="bg-[#06101d] border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-3">
                  <span>STRESS ANALYSIS MODEL</span>
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase mb-0.5">Baseline</p>
                    <p className="text-lg font-bold text-white font-mono">5.07x</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase mb-0.5">Stressed (-25%)</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">3.80x</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-mono uppercase mb-0.5">Headroom</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">+2.55x</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Governance Sanction & Multi-Role Sign-Off Card matching screenshot */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Governance Sanction & Multi-Role Sign-Off
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mandatory Shariah & Credit Perfected Ledger
                </p>
              </div>
              <button 
                onClick={() => {
                  if (showToast) showToast('Exporting governance ledger receipt...');
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              {/* Role 1: Credit Analyst */}
              <div className="bg-[#08101d] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    CREDIT ANALYST
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                    NH
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">N. Hassan</p>
                    <p className="text-[10px] text-slate-400">10 Oct, 11:20 AM</p>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm text-center"
                >
                  SIGNED
                </button>
              </div>

              {/* Role 2: SCU Officer */}
              <div className="bg-[#08101d] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    SCU OFFICER
                  </span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                    ?
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">
                      {scuApproved ? 'Dr. Tariq Al-Otaibi' : 'Waiting...'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {scuApproved ? '10 Oct, 11:45 AM' : 'Pending Shariah Review'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setScuApproved(true);
                    if (showToast) showToast('SCU Shariah Compliance Officer sign-off recorded.');
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                    scuApproved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {scuApproved ? 'SIGNED' : 'PENDING'}
                </button>
              </div>

              {/* Role 3: Committee Sanction */}
              <div className="bg-[#08101d] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    COMMITTEE SANCTION
                  </span>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                    ?
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Waiting...</p>
                    <p className="text-[10px] text-slate-500">Locked Stage</p>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-2 bg-slate-900 text-slate-500 border border-slate-800 rounded-lg text-xs font-semibold text-center cursor-not-allowed"
                >
                  LOCKED
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Chat Input Bar matching screenshot */}
      <div className="max-w-4xl mx-auto w-full pt-4 sticky bottom-4">
        <div className="bg-[#0b1322] border border-slate-700/80 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
          <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Ask Sanad to simulate shocks, draft inquiries, or extract insights..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />

          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-all shadow-md shadow-blue-600/30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
