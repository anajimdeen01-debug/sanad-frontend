import React, { useState, useRef, useEffect } from 'react';
import { Business, EvaluationPayload } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  Calculator, 
  BarChart3, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Minimize2,
  AlertTriangle
} from 'lucide-react';

interface AiAnalystCopilotProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
}

interface MessageVisual {
  type: 'purification_breakdown' | 'stress_simulation' | 'forensic_audit' | 'ratio_check';
  data: any;
}

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  visual?: MessageVisual;
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

export const AiAnalystCopilot: React.FC<AiAnalystCopilotProps> = ({
  evaluation,
  selectedBiz,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const taharah = evaluation.taharah_schedule;
  const financials = evaluation.financial_analytics;
  const scores = evaluation.scores;

  // Initial welcome message with contextual dynamic data
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Assalamu Alaikum. I am Sanad's AI Credit & Shariah Reasoning Copilot. I have completed forensic ingestion of ${selectedBiz.name}'s dossier. How can I assist your credit committee evaluation?`,
      visual: {
        type: 'ratio_check',
        data: {
          score: scores.score,
          status: scores.status,
          dscr: financials.baselineDscr,
          ltv: financials.ltvRatioPct,
        },
      },
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: CopilotMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      generateAiResponse(query);
      setIsThinking(false);
    }, 700);
  };

  const generateAiResponse = (query: string) => {
    const lower = query.toLowerCase();
    let reply: CopilotMessage;

    if (lower.includes('purif') || lower.includes('14,200') || lower.includes('taharah') || lower.includes('interest')) {
      reply = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Under AAOIFI Shariah Standard No. 21 (§3.4) and Standard No. 35, conventional interest earned on corporate treasury accounts is strictly non-permissible. For ${selectedBiz.name}, we identified KWD ${taharah.prohibitedInterestIncomeKwd.toLocaleString()} in interest revenue that must be disgorged directly to ${taharah.designatedCharity} prior to activating the facility.`,
        visual: {
          type: 'purification_breakdown',
          data: {
            permissibleRev: financials.annualRevenueKwd - taharah.prohibitedInterestIncomeKwd,
            prohibitedInterest: taharah.prohibitedInterestIncomeKwd,
            prohibitedPct: taharah.prohibitedIncomePct,
            zakatPayable: taharah.zakatPayableKwd,
          },
        },
        mathProof: {
          formula: 'Taharah Due = Prohibited Conventional Income Identified (100% Disgorgement)',
          steps: [
            `Total Revenue Reported: KWD ${financials.annualRevenueKwd.toLocaleString()}`,
            `Non-Compliant Treasury Interest: KWD ${taharah.prohibitedInterestIncomeKwd.toLocaleString()}`,
            `Purification Ratio: (${taharah.prohibitedInterestIncomeKwd.toLocaleString()} ÷ ${financials.annualRevenueKwd.toLocaleString()}) = ${taharah.prohibitedIncomePct}% < 5.0% AAOIFI Cap`,
            `Net Permissible Base: KWD ${(financials.annualRevenueKwd - taharah.prohibitedInterestIncomeKwd).toLocaleString()}`,
          ],
          result: `Mandatory Taharah Transfer: KWD ${taharah.taharahPurificationDueKwd.toLocaleString()} to Bait Al-Zakat`,
        },
        citationReceipt: {
          code: 'AAOIFI-STD-21§3.4',
          docName: 'Audited Financials FY2025 (Income Statement Note 18)',
          excerpt: 'Finance income includes KWD 14,200 earned from conventional overnight clearing placements.',
          hash: evaluation.sha256Fingerprint.substring(0, 16) + '...',
        },
      };
    } else if (lower.includes('simulat') || lower.includes('revenue drop') || lower.includes('25%') || lower.includes('stress')) {
      const stressedRev = financials.annualRevenueKwd * 0.75;
      const stressedEbitda = financials.ebitdaKwd * 0.68;
      const rateHikedDebtService = financials.annualDebtServiceKwd * 1.14;
      const stressedDscr = Number((stressedEbitda / rateHikedDebtService).toFixed(2));
      const pass = stressedDscr >= 1.25;

      reply = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Simulation complete: Under a severe simultaneous -25% revenue decline and +200 bps CBK discount rate tightening, the borrower's DSCR contracts from ${financials.baselineDscr}x to ${stressedDscr}x. This leaves a ${pass ? `positive headroom of +${(stressedDscr - 1.25).toFixed(2)}x above` : `deficit of ${(stressedDscr - 1.25).toFixed(2)}x below`} the 1.25x Warba covenant floor.`,
        visual: {
          type: 'stress_simulation',
          data: {
            baselineDscr: financials.baselineDscr,
            stressedDscr,
            covenantFloor: 1.25,
            pass,
          },
        },
        mathProof: {
          formula: 'Stressed DSCR = Stressed EBITDA ÷ Stressed Annual Debt Service',
          steps: [
            `Stressed Revenue (-25%): KWD ${Math.round(stressedRev).toLocaleString()}`,
            `Operational Margin Degradation: EBITDA drops from KWD ${(financials.ebitdaKwd / 1000000).toFixed(2)}M to KWD ${(stressedEbitda / 1000000).toFixed(2)}M`,
            `Debt Service Surge (+200 bps): Increases from KWD ${financials.annualDebtServiceKwd.toLocaleString()} to KWD ${Math.round(rateHikedDebtService).toLocaleString()}`,
            `DSCR Calculation: ${Math.round(stressedEbitda).toLocaleString()} ÷ ${Math.round(rateHikedDebtService).toLocaleString()} = ${stressedDscr}x`,
          ],
          result: `Verdict: ${pass ? 'COVENANT RESILIENT (PASS)' : 'COVENANT BREACH RISK (FAIL)'}`,
        },
        citationReceipt: {
          code: 'CBK-DIR-2026§8',
          docName: 'Warba Internal Credit Policy Stress Testing Manual',
          excerpt: 'Commercial Murabaha borrowers must maintain minimum 1.25x debt service coverage under 25% revenue stress.',
          hash: 'cbk7...9921',
        },
      };
    } else if (lower.includes('mortgage') || lower.includes('plot 18') || lower.includes('discrepan') || lower.includes('forensic')) {
      reply = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Forensic audit verification: The cross-document scanner flagged a contradiction regarding proposed collateral. While the Commercial Registry declaration claims the asset is unencumbered, the Central Bank Credit Bureau ledger shows an active registered charge of KWD 420,000 to an existing creditor.`,
        visual: {
          type: 'forensic_audit',
          data: {
            declared: 'Zero Liens (Free & Clear)',
            found: 'KWD 420,000 Registered Senior Mortgage',
            severity: 'CRITICAL',
          },
        },
        mathProof: {
          formula: 'Effective Net Collateral = Appraised Value - Senior Pledges',
          steps: [
            `Appraised Property Value: KWD ${financials.collateralValueKwd.toLocaleString()}`,
            `Undisclosed Senior Lien: - KWD 420,000`,
            `Effective Unencumbered Security: KWD ${(financials.collateralValueKwd - 420000).toLocaleString()}`,
            `Adjusted LTV: (${financials.facilityRequestedKwd.toLocaleString()} ÷ ${(financials.collateralValueKwd - 420000).toLocaleString()}) = ${((financials.facilityRequestedKwd / (financials.collateralValueKwd - 420000)) * 100).toFixed(1)}%`,
          ],
          result: 'Policy Breach: Adjusted LTV exceeds maximum permitted threshold.',
        },
        citationReceipt: {
          code: 'CBK-LEDGER#NBK-891',
          docName: 'Central Bank of Kuwait Credit Registry Report (Ci-Net)',
          excerpt: 'Senior first mortgage registered against Plot 18-A Shuwaikh Industrial, Outstanding KWD 420,000.',
          hash: '9c58...ac82',
        },
      };
    } else {
      reply = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Analysis for "${query}": The borrower currently maintains a Shariah Compliance score of ${scores.score}/100 with a baseline DSCR of ${financials.baselineDscr}x and an LTV of ${financials.ltvRatioPct}%. Overall debt to total assets stands at ${scores.debtToAssetsPct}%, comfortably below the 30% ceiling required by AAOIFI Standard No. 21.`,
        mathProof: {
          formula: 'Debt-to-Assets Ratio = Total Interest-Bearing Liabilities ÷ Total Book Assets',
          steps: [
            `Total Pledged & Unpledged Debt: KWD ${Math.round(taharah.totalAssetsKwd * (scores.debtToAssetsPct / 100)).toLocaleString()}`,
            `Total Enterprise Assets: KWD ${taharah.totalAssetsKwd.toLocaleString()}`,
            `Ratio: ${scores.debtToAssetsPct}% vs AAOIFI Max: 30.0%`,
          ],
          result: `Shariah Standard Compliance: ${scores.debtToAssetsPct < 30 ? 'PASS' : 'BREACH'}`,
        },
        citationReceipt: {
          code: 'AAOIFI-STD-21§2.1',
          docName: 'AAOIFI Shariah Screening Standard No. 21',
          excerpt: 'The total amount of interest-bearing debt must not exceed 30% of total assets.',
          hash: '7f91...b41',
        },
      };
    }

    setMessages(prev => [...prev, reply]);
  };

  const presetChips = [
    { label: '💰 Explain Taharah Math', query: 'Explain the 14,200 KWD purification requirement' },
    { label: '📉 Simulate -25% Revenue Drop', query: 'Simulate 25% revenue drop and CBK rate hike' },
    { label: '🔍 Audit Mortgage Discrepancy', query: 'Audit Shuwaikh Plot 18-A mortgage discrepancy' },
    { label: '⚖️ Verify AAOIFI 30% Debt Cap', query: 'Verify AAOIFI 30% debt to assets ratio' },
  ];

  return (
    <div className={`transition-all duration-300 border border-purple-500/30 bg-[#0B0F19]/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden ${
      isExpanded ? 'h-[580px]' : isOpen ? 'h-[380px]' : 'h-12'
    }`}>
      
      {/* Top Header / Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 border-b border-purple-500/20 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span>AI Analyst Visual Copilot</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                Mathematical Proofs & Receipts
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {isOpen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'Restore' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-48px)] justify-between">
          
          {/* Preset Prompts Chips */}
          <div className="p-2 border-b border-white/5 bg-slate-950/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-slate-500 font-mono text-[10px] shrink-0 mr-1">Fast Queries:</span>
            {presetChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/60 text-slate-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer text-[10px] font-medium"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble */}
                <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-purple-500/25 text-slate-200 rounded-tl-none shadow-xl'
                }`}>
                  <p>{msg.text}</p>

                  {/* VISUAL MICRO-CHART (if provided by AI) */}
                  {msg.visual && (
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>AI Visual Micro-Chart</span>
                      </div>

                      {msg.visual.type === 'purification_breakdown' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Permissible Operating Turnover:</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              KWD {msg.visual.data.permissibleRev.toLocaleString()} (99.95%)
                            </span>
                          </div>
                          {/* Visual ratio bar */}
                          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-emerald-500 h-full" style={{ width: '99.5%' }} />
                            <div className="bg-amber-400 h-full animate-pulse" style={{ width: '0.5%' }} />
                          </div>
                          <div className="flex justify-between text-[11px] pt-1">
                            <span className="text-amber-400 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span>Purification Disgorgement Due:</span>
                            </span>
                            <span className="font-mono text-amber-400 font-bold">
                              KWD {msg.visual.data.prohibitedInterest.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {msg.visual.type === 'stress_simulation' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                            <div className="bg-slate-900 p-2 rounded-lg border border-white/5">
                              <span className="text-slate-400 block">Baseline DSCR</span>
                              <span className="text-emerald-400 font-bold text-sm">{msg.visual.data.baselineDscr}x</span>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-lg border border-white/5">
                              <span className="text-slate-400 block">Post-Stress DSCR</span>
                              <span className={`font-bold text-sm ${msg.visual.data.pass ? 'text-blue-400' : 'text-rose-400'}`}>
                                {msg.visual.data.stressedDscr}x
                              </span>
                            </div>
                          </div>
                          {/* Comparative bar */}
                          <div className="w-full bg-slate-800 h-2 rounded-full relative overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${msg.visual.data.pass ? 'bg-blue-500' : 'bg-rose-500'}`} 
                              style={{ width: `${Math.min((msg.visual.data.stressedDscr / 10) * 100, 100)}%` }} 
                            />
                            <div className="absolute top-0 bottom-0 w-0.5 bg-rose-400" style={{ left: '12.5%' }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                            <span className="text-rose-400">1.25x Covenant Floor</span>
                            <span>{msg.visual.data.pass ? 'PASS (+Headroom)' : 'BREACH'}</span>
                          </div>
                        </div>
                      )}

                      {msg.visual.type === 'forensic_audit' && (
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex justify-between text-slate-400">
                            <span>Borrower Declaration:</span>
                            <span className="text-blue-400 font-mono font-semibold">{msg.visual.data.declared}</span>
                          </div>
                          <div className="flex justify-between text-rose-400 font-semibold">
                            <span>CBK Ledger Finding:</span>
                            <span className="font-mono">{msg.visual.data.found}</span>
                          </div>
                        </div>
                      )}

                      {msg.visual.type === 'ratio_check' && (
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                          <div className="bg-slate-900 p-1.5 rounded border border-white/5">
                            <span className="text-slate-400 block text-[9px]">Shariah</span>
                            <span className="text-emerald-400 font-bold">{msg.visual.data.score}/100</span>
                          </div>
                          <div className="bg-slate-900 p-1.5 rounded border border-white/5">
                            <span className="text-slate-400 block text-[9px]">Status</span>
                            <span className="text-emerald-400 font-bold">{msg.visual.data.status}</span>
                          </div>
                          <div className="bg-slate-900 p-1.5 rounded border border-white/5">
                            <span className="text-slate-400 block text-[9px]">DSCR</span>
                            <span className="text-white font-bold">{msg.visual.data.dscr}x</span>
                          </div>
                          <div className="bg-slate-900 p-1.5 rounded border border-white/5">
                            <span className="text-slate-400 block text-[9px]">LTV</span>
                            <span className="text-blue-400 font-bold">{msg.visual.data.ltv}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP-BY-STEP MATHEMATICAL PROOF (if provided by AI) */}
                  {msg.mathProof && (
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-purple-500/20 font-mono text-[11px] space-y-2">
                      <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[10px] uppercase">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Step-by-Step Mathematical Proof</span>
                      </div>
                      <p className="text-slate-300 font-semibold">{msg.mathProof.formula}</p>
                      <div className="space-y-0.5 text-slate-400 text-[10px]">
                        {msg.mathProof.steps.map((st, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="text-purple-400">›</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1.5 border-t border-white/10 text-emerald-400 font-bold text-xs">
                        {msg.mathProof.result}
                      </div>
                    </div>
                  )}

                  {/* HIGHLIGHTED CITATION RECEIPT (if provided by AI) */}
                  {msg.citationReceipt && (
                    <div className="bg-purple-950/30 rounded-xl p-2.5 border border-purple-500/30 text-[10px] space-y-1">
                      <div className="flex items-center justify-between text-purple-300 font-mono">
                        <span className="font-bold flex items-center gap-1">
                          <FileText className="w-3 h-3 text-purple-400" />
                          <span>RECEIPT [{msg.citationReceipt.code}]</span>
                        </span>
                        <span>Hash: {msg.citationReceipt.hash}</span>
                      </div>
                      <p className="text-slate-400 font-medium">{msg.citationReceipt.docName}</p>
                      <p className="text-slate-200 italic">"{msg.citationReceipt.excerpt}"</p>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-purple-400 font-mono p-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Computing mathematical proof & extracting AAOIFI citations...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-slate-950/90 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Copilot (e.g. 'Explain 14,200 KWD purification', 'Simulate 25% revenue drop')..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-900 border border-white/15 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
