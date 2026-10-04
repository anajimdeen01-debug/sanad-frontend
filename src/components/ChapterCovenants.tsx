import React, { useState } from 'react';
import { StressScenario, FinancialAnalytics } from '../types';
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
import { SlidersHorizontal, ArrowUpRight, Activity } from 'lucide-react';

interface ChapterCovenantsProps {
  scenarios: StressScenario[];
  financials: FinancialAnalytics;
}

export const ChapterCovenants: React.FC<ChapterCovenantsProps> = ({
  scenarios,
  financials,
}) => {
  const [revenueShock, setRevenueShock] = useState<number>(-15);
  const [rateHikeBps, setRateHikeBps] = useState<number>(150);

  // Compute live interactive shock
  const ebitdaImpact = financials.ebitdaKwd * Math.max(0.1, 1 + (revenueShock * 1.5) / 100);
  const extraDebtService = financials.facilityRequestedKwd * (rateHikeBps / 10000);
  const totalDebtService = financials.annualDebtServiceKwd + extraDebtService;
  const liveDscr = Number((ebitdaImpact / totalDebtService).toFixed(2));
  const isPassing = liveDscr >= financials.covenantMinimumDscr;

  const chartData = [
    {
      name: 'Baseline',
      label: 'Baseline Operational Case',
      dscr: financials.baselineDscr,
      color: '#10B981',
      status: 'PASS',
    },
    {
      name: 'Shock 1',
      label: '-15% Revenue Contraction',
      dscr: scenarios[1]?.resultingDscr ?? 6.64,
      color: '#3B82F6',
      status: (scenarios[1]?.resultingDscr ?? 6.64) >= 1.25 ? 'PASS' : 'BREACH',
    },
    {
      name: 'Shock 2',
      label: '+150 bps CBK Discount Hike',
      dscr: scenarios[2]?.resultingDscr ?? 8.51,
      color: '#F59E0B',
      status: (scenarios[2]?.resultingDscr ?? 8.51) >= 1.25 ? 'PASS' : 'BREACH',
    },
    {
      name: 'Shock 3',
      label: 'Severe Combined Crisis',
      dscr: scenarios[3]?.resultingDscr ?? 7.13,
      color: (scenarios[3]?.resultingDscr ?? 7.13) >= 1.25 ? '#8B5CF6' : '#EF4444',
      status: (scenarios[3]?.resultingDscr ?? 7.13) >= 1.25 ? 'PASS' : 'BREACH',
    },
    {
      name: 'Simulated',
      label: `${revenueShock}% Rev / +${rateHikeBps}bps Rate`,
      dscr: liveDscr,
      color: isPassing ? '#14B8A6' : '#EF4444',
      status: isPassing ? 'PASS' : 'BREACH',
    },
  ];

  return (
    <article className="py-12 border-b border-white/[0.06] space-y-8">
      
      {/* Chapter Number & Heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            Chapter 02
          </span>
          <span className="h-px w-8 bg-slate-800" />
          <span className="text-xs font-mono text-blue-400/90">
            Monte Carlo Macro Stress Analysis
          </span>
        </div>
        <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
          Covenant Resilience & Stress Simulation
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Narrative & In-Text Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-sm text-slate-300 leading-relaxed font-light">
          
          <p className="text-base text-slate-200 font-normal">
            Debt Service Coverage Ratio (DSCR) represents the principal measure of borrower endurance against debt amortization obligations. 
            Under verified operational conditions, the baseline coverage stands at <span className="font-mono text-white font-medium">{financials.baselineDscr}x</span>, 
            providing a substantial safety margin above the <span className="font-mono text-white font-medium">{financials.covenantMinimumDscr}x</span> Warba Bank covenant threshold.
          </p>

          <p>
            To evaluate resilience across commodity supply chain contractions and monetary tightening cycles, the engine tested three consecutive stress vectors: 
            a 15% revenue volume slowdown, a 150 basis-point policy discount rate increase by the Central Bank of Kuwait, and a severe simultaneous contraction.
          </p>

          {/* Interactive Sensitivity In-Text Console */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
                <span>Interactive Committee Sensitivity Modeler</span>
              </span>
              <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                isPassing ? 'text-teal-300 bg-teal-950/60' : 'text-rose-300 bg-rose-950/60'
              }`}>
                Simulated DSCR: {liveDscr}x ({isPassing ? 'Pass' : 'Breach'})
              </span>
            </div>

            {/* Slider 1: Revenue Contraction */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Revenue Contraction Stress:</span>
                <span className="text-amber-400 font-semibold">{revenueShock}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="0"
                step="5"
                value={revenueShock}
                onChange={e => setRevenueShock(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-50% Severe Recession</span>
                <span>0% Baseline</span>
              </div>
            </div>

            {/* Slider 2: Rate Hike */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">CBK Benchmark Tightening:</span>
                <span className="text-blue-400 font-semibold">+{rateHikeBps} bps</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="25"
                value={rateHikeBps}
                onChange={e => setRateHikeBps(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 bps</span>
                <span>+500 bps CBK Monetary Shock</span>
              </div>
            </div>

          </div>

          <p className="text-xs text-slate-400 italic">
            *Covenant breach occurs if post-shock operational cash flows generate a debt coverage coefficient below 1.25x.
          </p>

        </div>

        {/* Minimalist Comparative Bar Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Comparative DSCR Under Shock</span>
            <span className="text-rose-400 font-semibold">Target: 1.25x</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }} 
                  domain={[0, (dataMax: number) => Math.max(Math.ceil(dataMax * 1.2), 3)]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#0E1322] border border-white/10 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-white">{d.label}</p>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-slate-400">DSCR:</span>
                            <span className="font-bold text-white">{d.dscr}x</span>
                            <span className={`text-[10px] ${d.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({d.status})
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={1.25} 
                  stroke="#EF4444" 
                  strokeDasharray="4 4" 
                  label={{ value: '1.25x', position: 'right', fill: '#EF4444', fontSize: 10, fontFamily: 'monospace' }}
                />
                <Bar dataKey="dscr" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Baseline Buffer</span>
              <span className="text-emerald-400 font-semibold">
                +{(financials.baselineDscr - 1.25).toFixed(2)}x
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Stressed Cushion</span>
              <span className={liveDscr >= 1.25 ? 'text-teal-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {liveDscr >= 1.25 ? `+${(liveDscr - 1.25).toFixed(2)}x` : `${(liveDscr - 1.25).toFixed(2)}x`}
              </span>
            </div>
          </div>

        </div>

      </div>

    </article>
  );
};
