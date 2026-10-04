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
import { 
  Activity, 
  SlidersHorizontal, 
  ShieldAlert, 
  CheckCircle, 
  Flame, 
  TrendingDown, 
  Percent,
  RefreshCw
} from 'lucide-react';

interface CovenantStressSimulatorProps {
  scenarios: StressScenario[];
  financials: FinancialAnalytics;
}

export const CovenantStressSimulator: React.FC<CovenantStressSimulatorProps> = ({
  scenarios,
  financials,
}) => {
  // Custom stress slider states for dynamic committee testing
  const [customRevShock, setCustomRevShock] = useState<number>(-20);
  const [customRateHikeBps, setCustomRateHikeBps] = useState<number>(200);

  // Calculate dynamic custom stress scenario
  // Revenue shock reduces EBITDA by roughly proportional operational leverage (e.g. 1.8x operational multiplier)
  const ebitdaImpactFactor = Math.max(0.1, 1 + (customRevShock * 1.5) / 100);
  const customEbitda = financials.ebitdaKwd * ebitdaImpactFactor;
  // Rate hike increases annual debt service by rate hike bps on facility
  const rateHikeDecimal = customRateHikeBps / 10000;
  const extraDebtService = financials.facilityRequestedKwd * rateHikeDecimal;
  const customDebtService = financials.annualDebtServiceKwd + extraDebtService;
  const customDscr = Number((customEbitda / customDebtService).toFixed(2));
  const isCustomPass = customDscr >= financials.covenantMinimumDscr;

  // Chart data preparation
  const chartData = [
    {
      name: 'Baseline',
      dscr: scenarios[0]?.resultingDscr ?? financials.baselineDscr,
      status: 'PASS',
      color: '#10B981', // Emerald
      label: 'Norm Case',
      details: 'Current verified operating cash flow',
    },
    {
      name: 'Shock 1',
      dscr: scenarios[1]?.resultingDscr ?? 6.64,
      status: (scenarios[1]?.resultingDscr ?? 6.64) >= 1.25 ? 'PASS' : 'BREACH',
      color: '#3B82F6', // Blue
      label: '-15% Revenue',
      details: 'Macro sales & volume slump',
    },
    {
      name: 'Shock 2',
      dscr: scenarios[2]?.resultingDscr ?? 8.51,
      status: (scenarios[2]?.resultingDscr ?? 8.51) >= 1.25 ? 'PASS' : 'BREACH',
      color: '#F59E0B', // Amber
      label: '+150 bps Rate',
      details: 'CBK policy benchmark hike',
    },
    {
      name: 'Shock 3',
      dscr: scenarios[3]?.resultingDscr ?? 7.13,
      status: (scenarios[3]?.resultingDscr ?? 7.13) >= 1.25 ? 'PASS' : 'BREACH',
      color: (scenarios[3]?.resultingDscr ?? 7.13) >= 1.25 ? '#8B5CF6' : '#EF4444', // Purple or Red
      label: 'Severe Combined',
      details: 'Concurrent volume drop & rate surge',
    },
    {
      name: 'Custom',
      dscr: customDscr,
      status: isCustomPass ? 'PASS' : 'BREACH',
      color: isCustomPass ? '#14B8A6' : '#EF4444', // Teal or Crimson
      label: `${customRevShock}% / +${customRateHikeBps}bp`,
      details: 'Live Committee Stress Test',
    },
  ];

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-emerald-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Covenant Stress-Testing Simulator</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                  4 Shocks + Custom
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Stress-testing borrower debt service coverage under macroeconomic shocks against the 1.25x covenant.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/50 border border-rose-500/30 px-2 py-0.5 rounded">
              Covenant Floor: 1.25x
            </span>
          </div>
        </div>

        {/* Visual Comparative Bar Chart */}
        <div className="h-56 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 20 }}>
              <XAxis 
                dataKey="label" 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} 
                domain={[0, (dataMax: number) => Math.max(Math.ceil(dataMax * 1.2), 3)]}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-white/20 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                        <p className="font-bold text-white">{data.name} ({data.label})</p>
                        <p className="text-slate-400 text-[11px]">{data.details}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-slate-300">Resulting DSCR:</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">{data.dscr}x</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            data.status === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                          }`}>
                            {data.status}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Red Dashed Covenant Reference Line */}
              <ReferenceLine 
                y={1.25} 
                stroke="#EF4444" 
                strokeDasharray="4 4" 
                strokeWidth={2}
                label={{ 
                  value: '1.25x Target Floor', 
                  position: 'top', 
                  fill: '#EF4444', 
                  fontSize: 10, 
                  fontFamily: 'monospace',
                  fontWeight: 600
                }}
              />
              <Bar dataKey="dscr" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shock Outcome Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {chartData.slice(0, 4).map((scen, idx) => (
            <div 
              key={idx}
              className={`p-2 rounded-xl border transition-colors ${
                scen.status === 'PASS'
                  ? 'bg-slate-900/60 border-emerald-500/20'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">{scen.name}</span>
                <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                  scen.status === 'PASS' ? 'text-emerald-400 bg-emerald-950/80' : 'text-rose-400 bg-rose-950/80'
                }`}>
                  {scen.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-extrabold font-mono text-white">{scen.dscr}x</span>
                <span className="text-[10px] text-slate-400">DSCR</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Custom Shock Sliders (Committee On-The-Fly Stress Test) */}
      <div className="mt-4 pt-3 border-t border-white/10 bg-slate-950/60 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Committee Shock Modeler</span>
          </span>
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
            isCustomPass 
              ? 'bg-teal-950/80 text-teal-300 border border-teal-500/30' 
              : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
          }`}>
            Simulated DSCR: {customDscr}x ({isCustomPass ? 'COVENANT PASS' : 'COVENANT BREACH'})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Revenue Shock Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Revenue Contraction:</span>
              <span className="font-mono text-amber-400 font-bold">{customRevShock}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="0"
              step="5"
              value={customRevShock}
              onChange={e => setCustomRevShock(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>-50% Extreme Crisis</span>
              <span>0% Flat</span>
            </div>
          </div>

          {/* Rate Hike Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">CBK Rate Hike:</span>
              <span className="font-mono text-blue-400 font-bold">+{customRateHikeBps} bps</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={customRateHikeBps}
              onChange={e => setCustomRateHikeBps(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>0 bps</span>
              <span>+500 bps CBK Squeeze</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
