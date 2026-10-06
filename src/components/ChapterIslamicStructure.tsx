import React, { useState } from 'react';
import { TaharahSchedule, Business, FinancialAnalytics, MemoSection } from '../types';
import { ArrowRight, Coins, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface ChapterIslamicStructureProps {
  schedule: TaharahSchedule;
  financials: FinancialAnalytics;
  selectedBiz: Business;
  memoSection?: MemoSection;
}

export const ChapterIslamicStructure: React.FC<ChapterIslamicStructureProps> = ({
  schedule,
  financials,
  selectedBiz,
  memoSection,
}) => {
  const [selectedCharity, setSelectedCharity] = useState<string>(schedule.designatedCharity);

  return (
    <article className="py-12 border-b border-white/[0.06] space-y-8">
      
      {/* Chapter Number & Heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            Chapter 04
          </span>
          <span className="h-px w-8 bg-slate-800" />
          <span className="text-xs font-mono text-amber-400/90">
            AAOIFI Standards 21 & 35 Compliance
          </span>
        </div>
        <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
          Islamic Structuring & Taharah / Zakat Mandate
        </h2>
      </div>

      <div className="space-y-8">
        
        {/* Narrative Description */}
        {(() => {
          const dynamicParagraphs = memoSection?.text ? memoSection.text.split('\n\n').filter(p => p.trim().length > 0) : null;
          if (dynamicParagraphs && dynamicParagraphs.length > 0) {
            return (
              <div className="space-y-4 max-w-4xl">
                {dynamicParagraphs.map((para, idx) => (
                  <p key={idx} className={idx === 0 ? "text-base text-slate-200 leading-relaxed font-normal" : "text-sm text-slate-300 leading-relaxed font-light"}>
                    {para}
                  </p>
                ))}
              </div>
            );
          }
          return (
            <p className="text-sm text-slate-300 leading-relaxed font-light max-w-3xl">
              Islamic corporate facilities require strict segregation of prohibited earnings and transparent determination of enterprise Zakat. 
              Under AAOIFI Standard No. 35, the zakatable base is computed using the net working capital proxy method. 
              Furthermore, non-compliant income earned through conventional interest placements must undergo <em className="text-amber-300">Taharah (Purification)</em> 
              by irrevocable donation to designated public welfare entities prior to facility closing.
            </p>
          );
        })()}

        {/* Clean Horizontal Step-Down Visual Flow */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 lg:p-8 space-y-6">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/[0.06]">
            <span>Four-Tier Algorithmic Step-Down</span>
            <span className="text-amber-400">Lunar Calendar Basis (2.5%)</span>
          </div>

          {/* Horizontal Step-Down Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: Total Assets */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] space-y-1 relative">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                01 · Total Book Assets
              </span>
              <p className="font-mono text-lg lg:text-xl font-bold text-white tracking-tight">
                KWD {schedule.totalAssetsKwd.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">
                100% Consolidated Enterprise Base
              </p>
            </div>

            {/* Step 2: Zakatable Base (60%) */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-teal-500/20 space-y-1 relative">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                02 · Zakatable Base ({schedule.zakatableBaseProxyPct}%)
              </span>
              <p className="font-mono text-lg lg:text-xl font-bold text-teal-300 tracking-tight">
                KWD {schedule.zakatableBaseKwd.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">
                Net Working Capital Proxy
              </p>
            </div>

            {/* Step 3: Zakat Due @ 2.5% */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 relative">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                03 · Zakat Payable (2.5%)
              </span>
              <p className="font-mono text-lg lg:text-xl font-bold text-emerald-400 tracking-tight">
                KWD {schedule.zakatPayableKwd.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">
                Obligatory Annual Wealth Dues
              </p>
            </div>

            {/* Step 4: Taharah (Purification) */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 relative">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
                04 · Taharah Mandate
              </span>
              <p className="font-mono text-lg lg:text-xl font-bold text-amber-400 tracking-tight">
                KWD {schedule.taharahPurificationDueKwd.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">
                Prohibited Interest Income Disgorgement
              </p>
            </div>

          </div>

          {/* Charity Routing & Footnote */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/[0.06] text-xs">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Designated Charity Recipient:</span>
              <select
                value={selectedCharity}
                onChange={e => setSelectedCharity(e.target.value)}
                className="bg-transparent border border-white/10 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
              >
                <option value="Bait Al-Zakat Kuwait (General Waqf Fund)" className="bg-[#090D16]">Bait Al-Zakat Kuwait (General Waqf)</option>
                <option value="Kuwait Red Crescent Society (Medical Aid)" className="bg-[#090D16]">Kuwait Red Crescent (Medical Aid)</option>
                <option value="Bait Al-Zakat (Kuwait Humanitarian Medical Aid)" className="bg-[#090D16]">Bait Al-Zakat (Humanitarian)</option>
              </select>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              AAOIFI Shariah Standard No. 21 (§3.4) & Standard No. 35
            </span>
          </div>

        </div>

      </div>

    </article>
  );
};
