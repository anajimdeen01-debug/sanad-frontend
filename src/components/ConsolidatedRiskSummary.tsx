import React, { useState } from 'react';
import { EvaluationPayload, Business, Discrepancy } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  SlidersHorizontal, 
  Eye, 
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  Cell 
} from 'recharts';
import { DocumentCompareModal } from './DocumentCompareModal';

interface ConsolidatedRiskSummaryProps {
  business: Business;
  evaluation: EvaluationPayload;
  onApprove: (role: 'credit_analyst' | 'scu' | 'committee', officerName: string) => Promise<void>;
  isApproving: boolean;
  lang?: 'en' | 'ar';
}

export const ConsolidatedRiskSummary: React.FC<ConsolidatedRiskSummaryProps> = ({
  business,
  evaluation,
  onApprove,
  isApproving,
  lang = 'en',
}) => {
  const { financials, scores, discrepancies, verdict, taharah_schedule, approval_workflow } = {
    financials: evaluation.financial_analytics,
    scores: evaluation.scores,
    discrepancies: evaluation.discrepancies || [],
    verdict: evaluation.verdict,
    taharah_schedule: evaluation.taharah_schedule,
    approval_workflow: evaluation.approval_workflow,
  };

  const [revenueShock, setRevenueShock] = useState<number>(-15);
  const [rateHikeBps, setRateHikeBps] = useState<number>(150);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<Discrepancy | null>(null);

  // Math calculations
  const score = scores.score || 75;
  const isCompliant = score >= 80;
  const isConditional = score >= 60 && score < 80;
  const strokeColor = isCompliant ? '#10B981' : isConditional ? '#F59E0B' : '#EF4444';

  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301
  const arcLength = circumference * (240 / 360); // 240 deg arc ~201
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  // Live stress simulation
  const ebitdaImpact = financials.ebitdaKwd * Math.max(0.1, 1 + (revenueShock * 1.5) / 100);
  const extraDebtService = financials.facilityRequestedKwd * (rateHikeBps / 10000);
  const totalDebtService = financials.annualDebtServiceKwd + extraDebtService;
  const liveDscr = Number((ebitdaImpact / totalDebtService).toFixed(2));
  const isDscrPass = liveDscr >= financials.covenantMinimumDscr;

  const chartData = [
    { name: 'Baseline', dscr: financials.baselineDscr, color: financials.baselineDscr >= 1.25 ? '#10B981' : '#EF4444' },
    { name: 'Shock 1 (-15%)', dscr: evaluation.stress_scenarios?.[1]?.resultingDscr ?? 0.66, color: '#3B82F6' },
    { name: 'Shock 2 (+150bps)', dscr: evaluation.stress_scenarios?.[2]?.resultingDscr ?? 0.81, color: '#F59E0B' },
    { name: 'Simulated', dscr: liveDscr, color: isDscrPass ? '#14B8A6' : '#EF4444' },
  ];

  const isSuspended = verdict.status === 'FACILITY_SUSPENDED' || score < 60 || financials.baselineDscr < 1.0;
  const isApproved = verdict.status === 'SANCTION_APPROVED' || (score >= 80 && discrepancies.length === 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Clean Top Executive Verdict Banner */}
      <div className={`p-6 rounded-2xl border ${
        isSuspended 
          ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
          : isApproved 
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
          : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
              isSuspended 
                ? 'bg-rose-950 text-rose-300 border-rose-500/50' 
                : isApproved 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' 
                : 'bg-amber-950 text-amber-300 border-amber-500/50'
            }`}>
              {verdict.status.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Rating: {business.riskRating || 'A'} · {business.sector}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>Turnover: <strong className="text-white">KWD {(financials.annualRevenueKwd / 1000000).toFixed(1)}M</strong></div>
            <div>Facility: <strong className="text-white">KWD {(business.facility_requested / 1000000).toFixed(2)}M</strong></div>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-light mt-3">
          {verdict.analyst_rationale || verdict.title}
        </p>

        {/* 4 Essential Metric Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-white/[0.06] text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">SHARIAH SCORE</span>
            <span className={`text-base font-bold ${score >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {score} / 100
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">BASELINE DSCR</span>
            <span className={`text-base font-bold ${financials.baselineDscr >= 1.25 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {financials.baselineDscr}x <span className="text-[10px] text-slate-500 font-normal">(Min 1.25x)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">LOAN-TO-VALUE (LTV)</span>
            <span className="text-base font-bold text-white">
              {financials.ltvRatioPct}% <span className="text-[10px] text-slate-500 font-normal">(Max 80%)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">PURIFICATION (TAHARAH)</span>
            <span className="text-base font-bold text-amber-400">
              KWD {taharah_schedule.taharahPurificationDueKwd.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Focused Dual-Analysis Grid: Shariah & Covenant Resilience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card A: Shariah Screening Breakdown */}
        <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                AAOIFI Standard No. 21
              </span>
              <h3 className="font-editorial text-lg text-white font-medium">Shariah Health & Screening</h3>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
              isCompliant ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-rose-950 text-rose-300 border-rose-500/40'
            }`}>
              {scores.status}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Minimalist Dial */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform rotate-[150deg]" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#1E293B" strokeWidth="8" strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round" />
                <circle cx="60" cy="60" r={radius} fill="transparent" stroke={strokeColor} strokeWidth="8" strokeDasharray={`${arcLength} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold text-white">{score}</span>
                <span className="text-[9px] text-slate-500 font-mono">/100</span>
              </div>
            </div>

            {/* Line item ratios */}
            <div className="flex-1 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-slate-400">Haram Income Ratio:</span>
                <span className={`font-bold ${scores.haramRevenueRatioPct <= 5.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scores.haramRevenueRatioPct}% <span className="text-slate-500 font-normal">(Cap 5%)</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-slate-400">Debt to Assets:</span>
                <span className={`font-bold ${scores.debtToAssetsPct <= 30.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scores.debtToAssetsPct}% <span className="text-slate-500 font-normal">(Cap 30%)</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-slate-400">Liquid Assets:</span>
                <span className="text-slate-200">
                  {scores.liquidAssetsRatioPct}% <span className="text-slate-500 font-normal">(Floor 33%)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-light">
            <span className="font-semibold text-white block text-[11px] mb-0.5">Shariah Supervisory Opinion:</span>
            {scores.shariahBoardOpinion || 'Screening complies with AAOIFI standards subject to purification.'}
          </div>
        </div>

        {/* Card B: Covenant & Cash Flow Resilience */}
        <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                Covenant Floor: 1.25x
              </span>
              <h3 className="font-editorial text-lg text-white font-medium">Debt Service Coverage (DSCR)</h3>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
              financials.baselineDscr >= 1.25 ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-rose-950 text-rose-300 border-rose-500/40'
            }`}>
              {financials.baselineDscr >= 1.25 ? 'PASS' : 'BREACH'}
            </span>
          </div>

          {/* Clean Recharts Bar Chart */}
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} domain={[0, Math.max(2, financials.baselineDscr * 1.2)]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <ReferenceLine y={1.25} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Floor 1.25x', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }} />
                <Bar dataKey="dscr" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Sensitivity Sliders */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06] text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Revenue Stress:</span>
                <span className="text-amber-400 font-bold">{revenueShock}%</span>
              </div>
              <input 
                type="range" min="-40" max="0" value={revenueShock} 
                onChange={(e) => setRevenueShock(Number(e.target.value))} 
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Rate Hike (bps):</span>
                <span className="text-blue-400 font-bold">+{rateHikeBps} bps</span>
              </div>
              <input 
                type="range" min="0" max="400" step="25" value={rateHikeBps} 
                onChange={(e) => setRateHikeBps(Number(e.target.value))} 
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">Simulated DSCR Outcome:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${isDscrPass ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                {liveDscr}x {isDscrPass ? '(Sufficient)' : '(Breach)'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Forensic Discrepancy Findings (If any exist) */}
      {discrepancies.length > 0 && (
        <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="font-editorial text-lg text-white font-medium">Cross-Document Forensic Conflicts</h3>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
              {discrepancies.length} Conflicts Detected
            </span>
          </div>

          <div className="space-y-3">
            {discrepancies.map((d) => (
              <div 
                key={d.id}
                onClick={() => setSelectedDiscrepancy(d)}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/30 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                      {d.severity}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                      {d.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light line-clamp-1">
                    {d.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {d.financialImpactKwd && (
                    <span className="text-xs font-mono font-semibold text-rose-400">
                      Exposure: KWD {d.financialImpactKwd.toLocaleString()}
                    </span>
                  )}
                  <button className="flex items-center gap-1 text-xs font-mono text-blue-400 group-hover:underline">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Governance Sign-Off Actions */}
      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3 text-slate-400">
          <span>Endorsements:</span>
          <span className={approval_workflow.creditAnalyst.approved ? 'text-emerald-400' : 'text-slate-500'}>
            Analyst {approval_workflow.creditAnalyst.approved ? '✓' : '(Pending)'}
          </span>
          <span>·</span>
          <span className={approval_workflow.scuReviewer.approved ? 'text-emerald-400' : 'text-slate-500'}>
            SCU {approval_workflow.scuReviewer.approved ? '✓' : '(Pending)'}
          </span>
          <span>·</span>
          <span className={approval_workflow.committeeSanction.approved ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
            Committee {approval_workflow.committeeSanction.approved ? '✓' : '(Pending)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!approval_workflow.creditAnalyst.approved && (
            <button
              onClick={() => onApprove('credit_analyst', 'Ahmad Al-Sabah, CFA')}
              disabled={isApproving}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer"
            >
              Sign as Analyst
            </button>
          )}

          {!approval_workflow.scuReviewer.approved && approval_workflow.creditAnalyst.approved && (
            <button
              onClick={() => onApprove('scu', 'Dr. Tariq Al-Otaibi')}
              disabled={isApproving}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer"
            >
              Sign as SCU
            </button>
          )}

          {!approval_workflow.committeeSanction.approved && approval_workflow.creditAnalyst.approved && approval_workflow.scuReviewer.approved && (
            <button
              onClick={() => onApprove('committee', 'Corporate Credit Committee')}
              disabled={isApproving}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Sanction Facility
            </button>
          )}
        </div>
      </div>

      {/* Discrepancy Compare Modal */}
      <DocumentCompareModal
        discrepancy={selectedDiscrepancy}
        onClose={() => setSelectedDiscrepancy(null)}
      />

    </div>
  );
};
