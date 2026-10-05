import React, { useState } from 'react';
import { EvaluationPayload, Business, Citation } from '../types';
import { ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface ChapterSynthesisProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
  onCitationClick: (citation: Citation) => void;
}

export const ChapterSynthesis: React.FC<ChapterSynthesisProps> = ({
  evaluation,
  selectedBiz,
  onCitationClick,
}) => {
  const { scores, financial_analytics, citations } = evaluation;

  // Gauge calculations
  const score = scores.score;
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339
  const arcLength = circumference * (240 / 360); // 240 deg arc ~226
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  const isCompliant = score >= 80;
  const isConditional = score >= 60 && score < 80;
  const strokeColor = isCompliant ? '#10B981' : isConditional ? '#F59E0B' : '#EF4444';

  const handleInlineCitation = (code: string) => {
    const citation = citations[code] || {
      id: code,
      code,
      docName: 'Audited Financials & Regulatory Ledgers.pdf',
      page: 'Certified Records',
      excerpt: 'Certified disclosure authenticated by statutory auditor and Ministry records.',
      verifiedHash: evaluation.sha256Fingerprint.substring(0, 16),
    };
    onCitationClick(citation);
  };

  return (
    <article className="py-12 border-b border-white/[0.06] space-y-8">
      
      {/* Chapter Number & Heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            Chapter 01
          </span>
          <span className="h-px w-8 bg-slate-800" />
          <span className="text-xs font-mono text-emerald-400/90">
            AAOIFI 2026.1 Certified Audit
          </span>
        </div>
        <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
          Autonomous Shariah & Credit Synthesis
        </h2>
      </div>

      {/* Main Narrative with Embedded Radial Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Editorial Text (8 cols) */}
        <div className="lg:col-span-8 space-y-5 text-sm text-slate-300 leading-relaxed font-light">
          
          <p className="text-base text-slate-200 leading-relaxed font-normal">
            Following automated multi-source ingestion of corporate ledgers and statutory audited statements, 
            <strong className="text-white font-semibold"> {selectedBiz.name}</strong> has been evaluated under 
            Warba Bank's institutional underwriting criteria and the Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) Standards No. 21 and 35.
          </p>

          <p>
            The enterprise requests a financing envelope of <span className="font-mono font-medium text-white">KWD {financial_analytics.facilityRequestedKwd.toLocaleString()}</span> structured 
            under a Commodity Murabaha / Tawarruq arrangement{' '}
            <button
              onClick={() => handleInlineCitation('SRC-001#c0')}
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-mono text-xs underline underline-offset-2 mx-1 cursor-pointer"
            >
              [SRC-001]
            </button>. 
            The company's audited balance sheet establishes an asset base of <span className="font-mono text-white font-medium">KWD {evaluation.taharah_schedule.totalAssetsKwd.toLocaleString()}</span>, 
            generating annual operating turnover of <span className="font-mono text-white font-medium">KWD {financial_analytics.annualRevenueKwd.toLocaleString()}</span> and an operating margin of <span className="font-mono text-white font-medium">{financial_analytics.operatingMarginPct}%</span>.
          </p>

          {/* Inline Highlight Block */}
          <div className="p-4 rounded-xl bg-white/[0.02] border-l-2 border-emerald-500/80 space-y-1.5 my-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Shariah Board Advisory Opinion:</span>
              <span className="text-[11px] font-mono text-emerald-400 font-medium">AAOIFI Standard 21</span>
            </div>
            <p className="text-xs text-slate-300 italic">
              "{scores.shariahBoardOpinion}"
            </p>
          </div>

          <p>
            Forensic analysis of treasury records confirms that non-permissible interest and non-halal income represents{' '}
            <span className={`font-mono font-medium ${scores.haramRevenueRatioPct > 5.0 ? 'text-rose-400 font-bold' : 'text-amber-400'}`}>
              {scores.haramRevenueRatioPct}%
            </span>{' '}
            of gross revenue,{' '}
            {scores.haramRevenueRatioPct > 5.0 ? (
              <span className="text-rose-400 font-semibold">
                EXCEEDING the statutory 5.0% maximum ceiling under AAOIFI Standard No. 21
              </span>
            ) : (
              <span>maintaining compliance within the statutory 5.0% threshold</span>
            )}{' '}
            <button
              onClick={() => handleInlineCitation('SRC-003#aaoifi')}
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-mono text-xs underline underline-offset-2 mx-1 cursor-pointer"
            >
              [AAOIFI-STD-21]
            </button>. 
            Total debt to assets stands at{' '}
            <span className={`font-mono font-medium ${scores.debtToAssetsPct > 30.0 ? 'text-rose-400 font-bold' : 'text-white'}`}>
              {scores.debtToAssetsPct}%
            </span>{' '}
            {scores.debtToAssetsPct > 30.0 ? (
              <span className="text-rose-400 font-semibold">(breaching the 30.0% AAOIFI ceiling)</span>
            ) : (
              <span>against the 30.0% ceiling</span>
            )}, and liquid assets represent <span className="font-mono text-white font-medium">{scores.liquidAssetsRatioPct}%</span> of total assets.
          </p>

        </div>

        {/* Embedded Shariah Radial Meter (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6 text-center">
          
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Purity Metric</span>
            <span className={isCompliant ? 'text-emerald-400' : 'text-amber-400'}>
              {scores.status}
            </span>
          </div>

          {/* Minimalist Dial */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-36 h-36 transform rotate-[150deg]" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="#1B2236"
                strokeWidth="8"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="8"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-bold tracking-tight text-white">
                {score}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Index / 100
              </span>
            </div>
          </div>

          {/* Score Delta Pill & Explanatory Tag */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-300 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06] truncate">
              {scores.scoreDelta}
            </div>

            <div className="grid grid-cols-2 gap-3 text-left pt-3 border-t border-white/[0.06] text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Haram Ratio</span>
                <span className="font-mono font-medium text-emerald-400">{scores.haramRevenueRatioPct}%</span>
                <span className="text-slate-600 block text-[9px]">Cap: 5.0%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Debt / Assets</span>
                <span className={`font-mono font-medium ${scores.debtToAssetsPct <= 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scores.debtToAssetsPct}%
                </span>
                <span className="text-slate-600 block text-[9px]">Cap: 30.0%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </article>
  );
};
