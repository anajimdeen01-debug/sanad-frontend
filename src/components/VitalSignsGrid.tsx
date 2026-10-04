import React, { useState } from 'react';
import { EvaluationPayload, Business } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  KeyRound, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Sliders,
  DollarSign
} from 'lucide-react';

interface VitalSignsGridProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
  onOpenAuditModal: () => void;
}

export const VitalSignsGrid: React.FC<VitalSignsGridProps> = ({
  evaluation,
  selectedBiz,
  onOpenAuditModal,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [dscrSensitivityDelta, setDscrSensitivityDelta] = useState(0); // -20% to +20% EBITDA

  const { scores, financial_analytics, sha256Fingerprint, merkleRoot, blockHeight } = evaluation;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Fingerprint);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Dynamic color for Shariah Gauge
  const getShariahColor = (score: number) => {
    if (score >= 80) return { main: '#10B981', ring: 'stroke-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/30' };
    if (score >= 60) return { main: '#F59E0B', ring: 'stroke-amber-500', text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/30' };
    return { main: '#EF4444', ring: 'stroke-rose-500', text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-500/30' };
  };

  const shariahStyle = getShariahColor(scores.score);

  // Compute live DSCR with sensitivity delta
  const adjustedEbitda = financial_analytics.ebitdaKwd * (1 + dscrSensitivityDelta / 100);
  const liveDscr = Number((adjustedEbitda / financial_analytics.annualDebtServiceKwd).toFixed(2));
  const isDscrPass = liveDscr >= financial_analytics.covenantMinimumDscr;
  const dscrBuffer = Number((liveDscr - financial_analytics.covenantMinimumDscr).toFixed(2));

  // Gauge SVG math
  const score = scores.score;
  const radius = 68;
  const circumference = 2 * Math.PI * radius; // ~427
  // Arc spans 240 degrees (from 150 deg to 390 deg)
  const arcLength = circumference * (240 / 360); // ~285
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      {/* 1. Shariah Compliance Gauge (Emerald/Amber/Red Dial) */}
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Shariah Compliance Gauge</h3>
              <p className="text-[10px] text-slate-400">AAOIFI Standard No. 21 Screen</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${shariahStyle.bg} ${shariahStyle.text} border ${shariahStyle.border}`}>
            {scores.status}
          </span>
        </div>

        {/* Visual Dial Meter */}
        <div className="flex items-center justify-center my-2 relative">
          <svg className="w-36 h-36 transform rotate-[150deg]" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#1E293B"
              strokeWidth="12"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Colored Dynamic Value Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={shariahStyle.main}
              strokeWidth="12"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Score in Dial */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${shariahStyle.text}`}>
              {scores.score}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Score / 100
            </span>
          </div>
        </div>

        {/* Dynamic Score Diff Pill */}
        <div className="space-y-2">
          <div className={`text-[11px] font-medium px-2 py-1 rounded text-center truncate ${
            scores.score >= 80 
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' 
              : scores.score >= 60 
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/20' 
              : 'bg-rose-950/60 text-rose-300 border border-rose-500/20'
          }`}>
            {scores.scoreDelta}
          </div>

          {/* Quick Metrics Breakdown */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5 text-[10px] text-slate-400">
            <div>
              <span className="block text-slate-400">Haram Rev:</span>
              <span className={`font-mono font-semibold ${scores.haramRevenueRatioPct < 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {scores.haramRevenueRatioPct}%
              </span>
            </div>
            <div>
              <span className="block text-slate-400">Debt/Asset:</span>
              <span className={`font-mono font-semibold ${scores.debtToAssetsPct < 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {scores.debtToAssetsPct}%
              </span>
            </div>
            <div>
              <span className="block text-slate-400">Liquid:</span>
              <span className="font-mono font-semibold text-blue-400">
                {scores.liquidAssetsRatioPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Financial Capacity Card (Electric Blue) */}
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Financial Capacity</h3>
              <p className="text-[10px] text-slate-400">Core Corporate P&L & LTV</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-500/30">
            {financial_analytics.operatingMarginPct}% Margin
          </span>
        </div>

        {/* Primary Capacity Numbers */}
        <div className="my-2 space-y-2">
          <div>
            <span className="text-[11px] text-slate-400 block">Annual Turnover</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {(financial_analytics.annualRevenueKwd / 1000000).toFixed(2)}M
              </span>
              <span className="text-xs font-mono text-blue-400">KWD</span>
              <span className="text-[10px] font-mono text-emerald-400 ml-auto font-semibold">
                +{financial_analytics.revenueGrowthPct}% YoY
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-400 block">EBITDA</span>
              <span className="text-sm font-bold font-mono text-slate-100">
                {(financial_analytics.ebitdaKwd / 1000000).toFixed(2)}M <span className="text-[10px] text-slate-400">KWD</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Net Income</span>
              <span className="text-sm font-bold font-mono text-slate-100">
                {(financial_analytics.netIncomeKwd / 1000000).toFixed(2)}M <span className="text-[10px] text-slate-400">KWD</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mini Sparkline Bars + LTV Badge */}
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Trailing 4 Quarters Trend:</span>
            <span className="text-blue-400 font-mono font-semibold">
              LTV: {financial_analytics.ltvRatioPct}%
            </span>
          </div>

          {/* Sparkline bar visual */}
          <div className="grid grid-cols-4 gap-1.5 h-7 items-end">
            {financial_analytics.quarterlyRevenueSparkline.map((val, idx) => {
              const maxVal = Math.max(...financial_analytics.quarterlyRevenueSparkline);
              const heightPct = Math.round((val / maxVal) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-1 group/bar">
                  <div className="w-full bg-slate-800 rounded-sm overflow-hidden h-6 flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-sm transition-all group-hover/bar:brightness-125"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono">Q{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Baseline DSCR Card (Emerald/Amber/Red with threshold line) */}
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Scale className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Baseline DSCR</h3>
              <p className="text-[10px] text-slate-400">Debt Service Coverage Ratio</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            isDscrPass 
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
          }`}>
            {isDscrPass ? 'PASS' : 'BREACH'}
          </span>
        </div>

        {/* Large DSCR Metric */}
        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              isDscrPass ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {liveDscr}x
            </span>
            <span className="text-xs text-slate-400 font-medium">Coverage</span>
          </div>

          {/* Interactive target threshold line */}
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400">Covenant Floor: 1.25x</span>
              <span className={dscrBuffer >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {dscrBuffer >= 0 ? `+${dscrBuffer}x buffer` : `${dscrBuffer}x deficit`}
              </span>
            </div>

            {/* Target line bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full relative overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isDscrPass ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(Math.max((liveDscr / 10) * 100, 10), 100)}%` }}
              />
              {/* 1.25x threshold marker tick (1.25 / 10 = 12.5%) */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10" 
                style={{ left: '12.5%' }}
                title="1.25x Covenant Minimum"
              />
            </div>
          </div>
        </div>

        {/* Quick Sensitivity Toggle */}
        <div className="pt-2 border-t border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-slate-500" />
              <span>Sensitivity Slider:</span>
            </span>
            <span className="font-mono text-slate-300 font-semibold">
              {dscrSensitivityDelta >= 0 ? `+${dscrSensitivityDelta}%` : `${dscrSensitivityDelta}%`} EBITDA
            </span>
          </div>

          <input
            type="range"
            min="-30"
            max="30"
            step="5"
            value={dscrSensitivityDelta}
            onChange={e => setDscrSensitivityDelta(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[9px] text-slate-400">
            <span>-30% Stress</span>
            <span>Base</span>
            <span>+30% Upside</span>
          </div>
        </div>
      </div>

      {/* 4. Cryptographic Trust Seal (Violet) */}
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <KeyRound className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Cryptographic Trust Seal</h3>
              <p className="text-[10px] text-slate-400">SHA-256 Tamper-Proof Audit</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>VERIFIED</span>
          </span>
        </div>

        {/* SHA-256 Hash Display Box with Copy */}
        <div className="my-2 bg-slate-950/80 rounded-xl p-2.5 border border-purple-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Dossier Integrity Hash:</span>
            <button
              onClick={handleCopyHash}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Copy Full SHA-256 Hash"
            >
              {copiedHash ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[10px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="font-mono text-xs font-bold text-purple-300 break-all bg-slate-900/60 p-1.5 rounded border border-white/5">
            {sha256Fingerprint.substring(0, 16)}...{sha256Fingerprint.substring(sha256Fingerprint.length - 12)}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Block Height:</span>
            <span className="text-slate-200 font-semibold">#{blockHeight}</span>
          </div>
        </div>

        {/* Merkle Root & View Audit Trail Action */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
            <span>Merkle: </span>
            <span className="font-mono text-slate-300">{merkleRoot.substring(0, 8)}...</span>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Verify Chain</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
};
