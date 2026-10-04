import React, { useState } from 'react';
import { EvaluationPayload, Business } from '../types';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { ShieldAlert, Compass, Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface DealRiskRadarProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
}

export const DealRiskRadar: React.FC<DealRiskRadarProps> = ({
  evaluation,
  selectedBiz,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const { scores, financial_analytics, discrepancies } = evaluation;

  // Compute 5 dimensions (0 to 100) dynamically from evaluation metrics:
  // 1. Shariah Purity: based on scores.score (0-100)
  const shariahPurity = Math.min(100, Math.max(0, scores.score));

  // 2. DSCR Debt Capacity: 1.25x = 65, 2.0x = 80, 5.0x+ = 98, <1.0x = 35
  const dscrVal = financial_analytics.baselineDscr;
  const dscrCapacity = Math.min(100, Math.max(15, Math.round(dscrVal >= 5 ? 96 : dscrVal >= 2 ? 82 : dscrVal >= 1.25 ? 68 : dscrVal >= 1.0 ? 45 : 25)));

  // 3. Collateral Cushion: LTV <= 50% -> 95, 60% -> 85, 75% -> 68, 80% -> 60, >85% -> 35
  const ltv = financial_analytics.ltvRatioPct;
  const collateralCushion = Math.min(100, Math.max(15, Math.round(ltv <= 50 ? 95 : ltv <= 60 ? 86 : ltv <= 70 ? 76 : ltv <= 80 ? 62 : 38)));

  // 4. Forensic Integrity: Zero discrepancies = 96, Low = 88, Medium = 72, High = 50, Critical = 25
  const hasCritical = discrepancies.some(d => d.severity === 'critical');
  const hasHigh = discrepancies.some(d => d.severity === 'high');
  const hasMed = discrepancies.some(d => d.severity === 'medium');
  const forensicIntegrity = hasCritical ? 24 : hasHigh ? 48 : hasMed ? 72 : discrepancies.length > 0 ? 86 : 98;

  // 5. Operational Margin: Margin >= 20% -> 92, >= 15% -> 82, >= 10% -> 68, < 8% -> 40
  const margin = financial_analytics.operatingMarginPct;
  const operationalMarginScore = Math.min(100, Math.max(20, Math.round(margin >= 20 ? 94 : margin >= 15 ? 82 : margin >= 10 ? 68 : margin >= 5 ? 50 : 32)));

  // Warba Bank Standard Policy Benchmark (The minimum acceptable hurdle)
  const warbaBenchmark = {
    'Shariah Purity': 80,
    'DSCR Debt Capacity': 65, // Corresponding to 1.25x
    'Collateral Cushion': 60, // Corresponding to 80% max LTV
    'Forensic Integrity': 80,
    'Operational Margin': 65,
  };

  const radarData = [
    {
      dimension: 'Shariah Purity',
      borrower: shariahPurity,
      benchmark: warbaBenchmark['Shariah Purity'],
      description: 'AAOIFI Standard 21 compliance, permissible income ratio, and non-core interest filtering.',
      metric: `${scores.score}/100 · ${scores.status}`,
    },
    {
      dimension: 'DSCR Debt Capacity',
      borrower: dscrCapacity,
      benchmark: warbaBenchmark['DSCR Debt Capacity'],
      description: 'Operating cash flow capacity to cover amortizing principal + Murabaha profit under stress.',
      metric: `${financial_analytics.baselineDscr}x DSCR (Floor: 1.25x)`,
    },
    {
      dimension: 'Collateral Cushion',
      borrower: collateralCushion,
      benchmark: warbaBenchmark['Collateral Cushion'],
      description: 'First-degree real estate and asset pledge coverage relative to requested Murabaha principal.',
      metric: `${ltv}% LTV (Warba Max: 80%)`,
    },
    {
      dimension: 'Forensic Integrity',
      borrower: forensicIntegrity,
      benchmark: warbaBenchmark['Forensic Integrity'],
      description: 'Cross-document alignment across commercial registries, CBK ledgers, and audited statements.',
      metric: hasCritical ? 'Critical Discrepancy Found' : discrepancies.length > 0 ? `${discrepancies.length} Minor Notes` : '100% Reconciled',
    },
    {
      dimension: 'Operational Margin',
      borrower: operationalMarginScore,
      benchmark: warbaBenchmark['Operational Margin'],
      description: 'EBITDA and gross operating margin sustainability across multi-year cycles.',
      metric: `${margin}% Operating Margin`,
    },
  ];

  // Overall posture
  const averageScore = Math.round((shariahPurity + dscrCapacity + collateralCushion + forensicIntegrity + operationalMarginScore) / 5);
  const isOverallPass = forensicIntegrity >= 60 && shariahPurity >= 70 && dscrCapacity >= 60;

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-blue-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>AI Deal Risk Radar</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 border border-blue-500/30">
                  5-Dimensional Spider Matrix
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Borrower Risk Footprint vs. Warba Bank Credit & Shariah Hurdle Benchmark
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              isOverallPass
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
            }`}>
              {isOverallPass ? 'PRIME RISK FIT' : 'HURDLE BREACH DETECTED'}
            </span>
          </div>
        </div>

        {/* Radar Visual Chart */}
        <div className="h-64 mt-2 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#64748B', fontSize: 9 }}
                stroke="#1E293B"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-white/20 p-2.5 rounded-xl shadow-2xl text-xs space-y-1 z-50">
                        <p className="font-bold text-white">{data.dimension}</p>
                        <p className="text-slate-400 text-[10px] max-w-[200px]">{data.description}</p>
                        <div className="pt-1 space-y-0.5 font-mono text-[11px]">
                          <div className="flex items-center justify-between gap-3 text-emerald-400">
                            <span>Borrower:</span>
                            <span className="font-bold">{data.borrower}/100</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-amber-400">
                            <span>Warba Hurdle:</span>
                            <span>{data.benchmark}/100</span>
                          </div>
                          <div className="text-[10px] text-slate-300 pt-0.5">
                            Metric: {data.metric}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Warba Minimum Hurdle Benchmark Radar (Amber dashed) */}
              <Radar
                name="Warba Bank Policy Hurdle"
                dataKey="benchmark"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.12}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              {/* Borrower Footprint Radar (Emerald or Crimson) */}
              <Radar
                name="Borrower Assessment"
                dataKey="borrower"
                stroke={isOverallPass ? '#10B981' : '#EF4444'}
                fill={isOverallPass ? '#10B981' : '#EF4444'}
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Legend 
                wrapperStyle={{ fontSize: 11, paddingTop: 6 }} 
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Cards Pill Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-2">
          {radarData.map(item => {
            const delta = item.borrower - item.benchmark;
            const isPassingDim = delta >= 0;
            return (
              <button
                key={item.dimension}
                onClick={() => setSelectedDimension(selectedDimension === item.dimension ? null : item.dimension)}
                className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedDimension === item.dimension
                    ? 'bg-slate-800 border-white/40 ring-1 ring-white/20'
                    : isPassingDim
                    ? 'bg-slate-900/60 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                }`}
              >
                <div className="text-[9px] font-semibold text-slate-300 truncate">{item.dimension}</div>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-xs font-mono font-bold text-white">{item.borrower}</span>
                  <span className={`text-[9px] font-mono font-bold ${isPassingDim ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {delta >= 0 ? `+${delta}` : delta}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Footer Dimension Explainer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {selectedDimension 
              ? radarData.find(d => d.dimension === selectedDimension)?.description
              : `Composite Deal Index: ${averageScore}/100 across 5 credit & Shariah dimensions`}
          </span>
        </span>
        <span className="font-mono text-slate-400 text-[10px]">
          Score Baseline: AAOIFI / CBK 2026
        </span>
      </div>

    </div>
  );
};
