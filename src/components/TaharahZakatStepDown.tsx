import React, { useState } from 'react';
import { TaharahSchedule } from '../types';
import { 
  HeartHandshake, 
  ArrowDown, 
  Sparkles, 
  FileCheck, 
  Layers, 
  CheckCircle2, 
  Info,
  Building,
  Coins
} from 'lucide-react';

interface TaharahZakatStepDownProps {
  schedule: TaharahSchedule;
  borrowerName: string;
}

export const TaharahZakatStepDown: React.FC<TaharahZakatStepDownProps> = ({
  schedule,
  borrowerName,
}) => {
  const [selectedCharity, setSelectedCharity] = useState<string>(schedule.designatedCharity);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-amber-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>AAOIFI Shariah Purification (Taharah) & Zakat</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                  Standard 21 / 35
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Four-stage algorithmic step-down isolating prohibited interest earnings and calculating enterprise Zakat liability.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Taharah Certificate</span>
          </button>
        </div>

        {/* Visual 4-Step Down Flow Cards */}
        <div className="mt-4 space-y-2 relative">
          
          {/* Connecting line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-amber-500 -z-0 opacity-40 hidden sm:block" />

          {/* STEP 1: Total Assets */}
          <div className="relative z-10 bg-slate-900/70 border border-white/10 hover:border-blue-500/30 rounded-xl p-3 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/30 text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                01
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200">Total Enterprise Assets</span>
                <p className="text-[11px] text-slate-400">Audited Balance Sheet Book Value</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold font-mono text-white">
                KWD {schedule.totalAssetsKwd.toLocaleString()}
              </span>
              <span className="block text-[10px] text-blue-400 font-mono">100% Asset Base</span>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>

          {/* STEP 2: Zakatable Base Proxy */}
          <div className="relative z-10 bg-slate-900/70 border border-white/10 hover:border-teal-500/30 rounded-xl p-3 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-500/30 text-teal-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                02
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200">Zakatable Base (@ {schedule.zakatableBaseProxyPct}% proxy)</span>
                <p className="text-[11px] text-slate-400">AAOIFI Working Capital Proxy Standard</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold font-mono text-white">
                KWD {schedule.zakatableBaseKwd.toLocaleString()}
              </span>
              <span className="block text-[10px] text-teal-400 font-mono">Working Capital Base</span>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* STEP 3: Zakat Payable @ 2.5% [Green Badge] */}
          <div className="relative z-10 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl p-3 flex items-center justify-between transition-colors shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                03
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-300">Zakat Payable @ {schedule.zakatRatePct}%</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    OBLIGATORY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Lunar Year Islamic Wealth Obligation</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold font-mono text-emerald-400">
                KWD {schedule.zakatPayableKwd.toLocaleString()}
              </span>
              <span className="block text-[10px] text-emerald-500 font-mono">Payable to Bait Al-Zakat</span>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="flex justify-center -my-1 text-slate-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* STEP 4: Taharah (Purification) Required [Amber Badge] */}
          <div className="relative z-10 bg-amber-950/25 border border-amber-500/40 hover:border-amber-500/60 rounded-xl p-3 flex items-center justify-between transition-colors shadow-lg shadow-amber-950/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                04
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300">Taharah (Purification) Mandate</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-900/80 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                    PURIFICATION DUE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Prohibited Conventional Interest Earnings ({schedule.prohibitedIncomePct}%)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold font-mono text-amber-400">
                KWD {schedule.taharahPurificationDueKwd.toLocaleString()}
              </span>
              <span className="block text-[10px] text-amber-500 font-mono">Disgorgement Mandate</span>
            </div>
          </div>

        </div>
      </div>

      {/* Designated Charity Routing & Shariah Rule Reference */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Designated Shariah Charity Channel:</span>
          </span>
          <select
            value={selectedCharity}
            onChange={e => setSelectedCharity(e.target.value)}
            className="bg-slate-900 border border-white/15 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400 font-medium"
          >
            <option value="Bait Al-Zakat Kuwait (General Waqf Fund)">Bait Al-Zakat Kuwait (Waqf)</option>
            <option value="Kuwait Red Crescent Society (Medical Aid)">Kuwait Red Crescent</option>
            <option value="Bait Al-Zakat (Kuwait Humanitarian Medical Aid)">Bait Al-Zakat (Medical)</option>
            <option value="Kuwait Food Bank Charity Foundation">Kuwait Food Bank</option>
          </select>
        </div>

        <p className="text-[10px] text-slate-400 italic">
          "{schedule.aaoifiReference}. Income earned via interest-bearing cash deposits cannot be recognized as corporate profit and must be irrevocably purged prior to credit line activation."
        </p>
      </div>

      {/* Shariah Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">AAOIFI Taharah Verification Deed</h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3 font-mono text-xs">
              <div className="text-center pb-2 border-b border-white/10">
                <p className="text-amber-400 font-bold text-sm">WARBA BANK SHARIAH GOVERNANCE</p>
                <p className="text-slate-400 text-[10px]">Certificate of Income Purification & Zakat Assessment</p>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Beneficiary:</span>
                  <span className="font-bold text-white">{borrowerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Zakatable Base:</span>
                  <span className="text-white">KWD {schedule.zakatableBaseKwd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Zakat Payable (2.5%):</span>
                  <span className="text-emerald-400 font-bold">KWD {schedule.zakatPayableKwd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Non-Permissible Earnings:</span>
                  <span className="text-rose-400 font-bold">KWD {schedule.prohibitedInterestIncomeKwd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/10">
                  <span className="text-amber-400 font-bold">Mandatory Taharah Due:</span>
                  <span className="text-amber-400 font-bold text-sm">KWD {schedule.taharahPurificationDueKwd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Charity Routing:</span>
                  <span className="text-slate-200">{selectedCharity}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
