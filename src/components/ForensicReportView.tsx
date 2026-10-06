/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { Business, EvaluationPayload } from '../types';

interface ForensicReportViewProps {
  business: Business | null;
  evaluation: EvaluationPayload | null;
  onCitationClick?: (code: string) => void;
  showToast?: (msg: string) => void;
}

export const ForensicReportView: React.FC<ForensicReportViewProps> = ({
  business,
  evaluation,
  showToast
}) => {
  const [selectedCitationModal, setSelectedCitationModal] = useState<{
    title: string;
    ref: string;
    sourceA: string;
    excerptA: string;
    sourceB: string;
    excerptB: string;
    impact: string;
  } | null>(null);

  const isGulfPearl = !business || business.id === 'biz_pearl' || business.name.toLowerCase().includes('pearl');
  const isQabas = business?.id === 'biz_qabas';
  const isManar = business?.id === 'biz_manar';

  const reportId = isGulfPearl 
    ? 'WRB-FORENSIC-2024-092' 
    : isQabas 
    ? 'WRB-FORENSIC-2024-041' 
    : isManar 
    ? 'WRB-FORENSIC-2024-067' 
    : `WRB-FORENSIC-2024-${business?.id?.slice(0, 4)?.toUpperCase() || '101'}`;

  const reportDate = isGulfPearl 
    ? '16 October 2024' 
    : isQabas 
    ? '04 October 2026' 
    : '12 October 2024';

  const entityName = isGulfPearl 
    ? 'Gulf Pearl Foods Trading W.L.L.' 
    : business?.name || 'Gulf Pearl Foods Trading W.L.L.';

  const handleExportPdf = () => {
    window.print();
    if (showToast) showToast('Printing forensic dossier memorandum...');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    if (showToast) showToast('Dossier memorandum link copied to clipboard.');
  };

  return (
    <div className="min-h-screen bg-[#070c16] text-slate-200 font-sans pb-16">
      {/* Top Bar Header matching UX Pilot */}
      <header className="sticky top-0 z-30 bg-[#091120]/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-bold tracking-wider text-xs uppercase">
              SANAD INTELLIGENCE
            </span>
          </div>

          <span className="text-slate-600 text-xs">|</span>

          <div className="font-mono text-[11px] text-slate-400 tracking-wide bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            REPORT ID: <span className="text-slate-200 font-medium">{reportId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm shadow-blue-600/30"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Report</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Center Memo Canvas & Right Telemetry Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CENTER / LEFT: Internal Memorandum Canvas */}
        <main className="lg:col-span-8 bg-[#0b1322] border border-slate-800/90 rounded-2xl p-7 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Watermark / Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 opacity-80" />

          {/* Memorandum Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-slate-800/80 gap-3">
            <div>
              <h1 className="text-sm font-bold tracking-widest text-slate-100 uppercase font-mono">
                INTERNAL MEMORANDUM
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Warba Bank - Institutional Banking Group
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-rose-400/90 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-mono">
                STRICTLY CONFIDENTIAL
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Copy No. 01</p>
            </div>
          </div>

          {/* Memorandum Metadata Block */}
          <div className="py-5 border-b border-slate-800/80 space-y-2 text-xs font-sans">
            <div className="grid grid-cols-12 gap-2 items-baseline">
              <span className="col-span-3 sm:col-span-2 font-mono text-slate-400 font-semibold tracking-wider uppercase">
                TO:
              </span>
              <span className="col-span-9 sm:col-span-10 text-slate-200 font-medium">
                Credit Committee / Shariah Supervisory Board
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2 items-baseline">
              <span className="col-span-3 sm:col-span-2 font-mono text-slate-400 font-semibold tracking-wider uppercase">
                FROM:
              </span>
              <div className="col-span-9 sm:col-span-10 flex items-center gap-2">
                <span className="text-slate-200 font-medium">SANAD (AI Senior Forensic Analyst)</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  VERIFIED
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 items-baseline">
              <span className="col-span-3 sm:col-span-2 font-mono text-slate-400 font-semibold tracking-wider uppercase">
                DATE:
              </span>
              <span className="col-span-9 sm:col-span-10 text-slate-300 font-medium font-mono">
                {reportDate}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2 items-baseline pt-1">
              <span className="col-span-3 sm:col-span-2 font-mono text-slate-400 font-semibold tracking-wider uppercase">
                SUBJECT:
              </span>
              <span className="col-span-9 sm:col-span-10 text-white font-bold text-sm tracking-tight">
                Forensic Risk Teardown: {entityName}
              </span>
            </div>
          </div>

          {/* Section I: EXECUTIVE SYNTHESIS */}
          <section className="pt-7 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono">
                I. EXECUTIVE SYNTHESIS
              </h2>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 space-y-3 font-normal">
              {isGulfPearl ? (
                <>
                  <p>
                    I have completed a deep-tissue forensic audit of the Gulf Pearl Foods credit dossier. My analysis moves beyond surface-level ratios to examine the underlying structural integrity of the borrower. My core finding is that{' '}
                    <span className="text-white font-medium underline decoration-slate-600 underline-offset-4">
                      the borrower is fundamentally profitable, with a 14.2% top-line growth rate that is substantiated by verified VAT filings and export customs data.
                    </span>
                  </p>
                  <p>
                    However, my scan has flagged a{' '}
                    <button
                      onClick={() =>
                        setSelectedCitationModal({
                          title: 'Collateral Valuation & Discrepancy',
                          ref: 'Ref #COLL-SHUW-04',
                          sourceA: 'Primary Credit Application',
                          excerptA: 'Asserts unencumbered title and unrestricted commercial appraisal at Shuwaikh Industrial Zone.',
                          sourceB: 'PACI & Municipal Land Registry Extract',
                          excerptB: 'Plot documentation indicates zoning compliance mismatch requiring municipal regularisation before legal perfection.',
                          impact: 'KWD 350,000 provisional reserve adjustment pending release.',
                        })
                      }
                      className="inline-flex items-center font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer"
                    >
                      critical documentation mismatch
                    </button>{' '}
                    regarding collateral valuation in the Shuwaikh industrial zone, and a non-compliant income stream that requires immediate purification before any facility drawdown can be sanctioned.
                  </p>
                </>
              ) : isQabas ? (
                <>
                  <p>
                    I have completed a deep-tissue forensic audit of the Qabas Trading dossier. My core finding is that{' '}
                    <span className="text-rose-300 font-medium underline decoration-rose-600 underline-offset-4">
                      the borrower fails foundational Warba underwriting criteria due to severe covenant collapse and an undisclosed registered first-degree mortgage lien of KWD 1,450,000.
                    </span>
                  </p>
                  <p>
                    Furthermore, AAOIFI screening identifies an 8.40% prohibited conventional income stream that substantially exceeds the 5.0% ceiling, rendering the facility inadmissible under Murabaha structures in its present state.
                  </p>
                </>
              ) : (
                <p>
                  I have completed an autonomous forensic audit of {entityName}. The borrower exhibits stable operational cash flows with positive top-line performance, subject to covenant calibration and Shariah purification verification.
                </p>
              )}
            </div>
          </section>

          {/* Section II: FINANCIAL & CASH FLOW FORENSICS */}
          <section className="py-7 border-b border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-blue-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono">
                II. FINANCIAL & CASH FLOW FORENSICS
              </h2>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 space-y-4">
              <p>
                Upon examining the 2023 audited financials against live transaction telemetry from the Ministry of Finance, I have reconstructed the cash-conversion cycle. The borrower demonstrates a{' '}
                <span className="text-white font-semibold">Days Sales Outstanding (DSO) of 42 days</span>, which is significantly better than the industry average of 58 days.
              </p>

              {/* Embedded Mini Card: LIQUIDITY INTELLIGENCE matching screenshot */}
              <div className="bg-[#08101d] border border-slate-800/90 rounded-xl p-4 my-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase mb-3">
                  <span>LIQUIDITY INTELLIGENCE</span>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                      CASH VELOCITY
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-white font-mono">
                        {isGulfPearl ? '1.2x' : isQabas ? '0.4x' : '1.1x'}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 font-mono">
                        {isGulfPearl ? '| 8%' : isQabas ? '-24%' : '+5%'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                      EBITDA MARGIN
                    </p>
                    <span className="text-base font-bold text-white font-mono">
                      {isGulfPearl ? '18.4%' : isQabas ? '10.7%' : '14.2%'}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                      INTEREST COVER
                    </p>
                    <span className="text-base font-bold text-white font-mono">
                      {isGulfPearl ? '6.2x' : isQabas ? '0.88x' : '2.45x'}
                    </span>
                  </div>
                </div>
              </div>

              <p>
                I have also identified a{' '}
                <span className="text-white font-semibold">
                  {isGulfPearl ? 'KWD 1.2M hidden liquidity reserve' : 'secondary cash flow cushion'}
                </span>{' '}
                in the form of unencumbered highly liquid inventory that was under-valued in the primary audit. This provides an additional secondary repayment cushion not previously captured by the manual underwriting team.
              </p>
            </div>
          </section>

          {/* Section III: CONFLICT & RISK ANOMALIES */}
          <section className="py-7 border-b border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-amber-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono">
                III. CONFLICT & RISK ANOMALIES
              </h2>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 space-y-3 font-normal">
              <p>
                My cross-document verification engine identified a{' '}
                <button
                  onClick={() =>
                    setSelectedCitationModal({
                      title: 'Forensic Discrepancy (Ref #F-922): Undisclosed Performance Bond',
                      ref: 'Ref #F-922',
                      sourceA: 'Credit Application Form 2024 (Borrower Affidavit)',
                      excerptA: 'Clause 5.2: "Total contingent liabilities, guarantees, and performance bonds: KWD 0 (Zero)."',
                      sourceB: 'Ministry of Justice Legal Gazette & Guarantee Register',
                      excerptB: 'Active Guarantee #MOJ-BG-2023-881: KWD 350,000 corporate performance bond issued on behalf of Pearl Logistics W.L.L. (CR #339102), with 30% common shareholding.',
                      impact: 'Material contingent liability representing rank dilution in liquidation.',
                    })
                  }
                  className="inline-flex items-center gap-1 font-mono font-medium text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer"
                >
                  Forensic Discrepancy (Ref #F-922)
                </button>
                . The primary credit application claims "Zero Contingent Liabilities." However, my automated scan of the Ministry of Justice legal database discovered an active{' '}
                <span className="text-white font-semibold">KWD 350,000 performance bond</span> issued to a sister company, Pearl Logistics, which has a 30% common shareholding.
              </p>
              <p>
                This undisclosed liability represents a material risk to the bank's ranking in a liquidation scenario. I recommend a{' '}
                <button
                  onClick={() =>
                    setSelectedCitationModal({
                      title: 'Recommended Mandatory Disclosure Clause',
                      ref: 'Clause 14.8 - Legal Perfection',
                      sourceA: 'Warba Legal Standard Master Murabaha',
                      excerptA: 'Requires borrower to warrant all affiliate guarantees and register subordination of sister-entity claims prior to initial facility drawdown.',
                      sourceB: 'CBK Circular No. 2/RB/2021',
                      excerptB: 'Mandatory cross-guarantee reporting for related parties exceeding 25% common beneficial ownership.',
                      impact: 'Legally shields Warba Bank ranking against sister-entity clawbacks.',
                    })
                  }
                  className="text-blue-400 font-medium underline underline-offset-2 hover:text-blue-300 cursor-pointer"
                >
                  Mandatory Disclosure Clause
                </button>{' '}
                be inserted into the facility agreement prior to signing.
              </p>
            </div>
          </section>

          {/* Section IV: SHARIAH INTEGRITY & TAHARAH */}
          <section className="py-7 border-b border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono">
                IV. SHARIAH INTEGRITY & TAHARAH
              </h2>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 space-y-3 font-normal">
              <p>
                I have screened every line item of the "Other Income" schedule for FY2023. I detected{' '}
                <span className="text-white font-semibold">
                  {isGulfPearl ? 'KWD 7,900' : isQabas ? 'KWD 340,000' : 'KWD 12,400'}
                </span>{' '}
                in interest income originating from a conventional fixed deposit account held with a non-Islamic regional bank.
              </p>
              <p>
                This is non-compliant under AAOIFI Standard No. 21. I have already calculated the exact{' '}
                <button
                  onClick={() =>
                    setSelectedCitationModal({
                      title: 'Taharah Purification Schedule & Remittance',
                      ref: 'AAOIFI Standard No. 21',
                      sourceA: 'Other Income Schedule (FY2023 Audited)',
                      excerptA: 'Line 14: Non-operating bank interest credit: KWD 7,900 from conventional deposit.',
                      sourceB: 'Warba Shariah Board Purification Directive',
                      excerptB: '100% of conventional interest must be remitted to Bait Al-Zakat Kuwait prior to drawdown certification. Zero retained value.',
                      impact: 'Facility certified Shariah-compliant post remittance.',
                    })
                  }
                  className="inline-flex items-center font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer"
                >
                  purification (Taharah) amount
                </button>{' '}
                and drafted the necessary remittance instructions for the borrower to execute through Bait Al-Zakat.
              </p>
            </div>
          </section>

          {/* ANALYST FINAL CONCLUSION matching screenshot */}
          <section className="pt-8 space-y-5">
            <div>
              <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                ANALYST FINAL CONCLUSION
              </p>
            </div>

            <blockquote className="text-sm sm:text-[15px] italic font-serif leading-relaxed text-slate-100 border-l-2 border-slate-700 pl-4 py-1">
              {isGulfPearl ? (
                `"I recommend sanctioning the Murabaha facility at KWD 1.25M, subject to the forensic remediation of the undisclosed logistics guarantee and verified Taharah purification. The borrower's core cash velocity is superior to its peers, justifying a BBB+ rating."`
              ) : isQabas ? (
                `"FACILITY SANCTION SUSPENDED. Credit Committee action withheld until complete mortgage release from NCB, debt restructuring below 30% ceiling, and KWD 920,000 Taharah disgorgement are executed."`
              ) : (
                `"I recommend conditional approval for the KWD 1.80M facility upon satisfactory covenant stress buffers and confirmed AAOIFI compliance checks."`
              )}
            </blockquote>

            {/* Signature Stamp matching screenshot */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                  SANAD AI FORENSIC AGENT
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Intelligence Core v4.2 • Verified Oct 16, 2024
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT: Live Context & AI Confidence Rail */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          {/* LIVE CONTEXT Card matching screenshot */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-5 shadow-xl">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-4">
              LIVE CONTEXT
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-200">MOCI Registry: </span>
                  <span className="text-slate-400">
                    Confirmed active commercial license (Exp: 2026).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-200">PACI Data: </span>
                  <span className="text-slate-400">
                    Address verified at Shuwaikh Industrial Area.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-200">CiNet: </span>
                  <span className="text-slate-400">
                    {isGulfPearl ? 'Zero defaults flagged in last 24 months.' : '1 past inquiry flagged; clean score.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI CONFIDENCE LEVEL Card matching screenshot */}
          <div className="bg-[#09152a] border border-blue-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-[10px] font-mono font-bold tracking-widest text-blue-300 uppercase mb-2">
              AI CONFIDENCE LEVEL
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {isGulfPearl ? '98.2' : isQabas ? '99.4' : '96.8'}
              </span>
              <span className="text-lg font-bold text-blue-400 font-mono">%</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-300">
              Based on 142 cross-verified data points from Ministry, Bank, and Third-party registries.
            </p>

            <div className="mt-4 pt-4 border-t border-blue-900/40 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Merkle Root: verified</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Perfected
              </span>
            </div>
          </div>

          {/* Quick Actions / Discrepancy Trigger */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-4 text-xs">
            <p className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-2">
              AUDIT TRAIL & CITATIONS
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() =>
                  setSelectedCitationModal({
                    title: 'Ref #F-922: Undisclosed Performance Bond',
                    ref: '#F-922',
                    sourceA: 'Borrower Credit Application (KWD 0 declared)',
                    excerptA: 'Clause 5.2 denies existence of off-balance sheet bonds.',
                    sourceB: 'Ministry of Justice Gazette #MOJ-BG-2023-881',
                    excerptB: 'Active guarantee of KWD 350,000 for Pearl Logistics W.L.L.',
                    impact: 'Liquidating priority impact: KWD 350k senior ranking threat.',
                  })
                }
                className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="truncate">
                  <span className="text-amber-300 font-mono font-medium">#F-922: </span>
                  <span className="text-slate-300">Undisclosed Bond KWD 350k</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              <button
                onClick={() =>
                  setSelectedCitationModal({
                    title: 'AAOIFI Standard 21 Taharah Remittance',
                    ref: 'AAOIFI-21',
                    sourceA: 'Audited Financials FY2023 Schedule 4',
                    excerptA: 'Conventional interest income KWD 7,900 from fixed deposit.',
                    sourceB: 'Bait Al-Zakat Charitable Allocation Directive',
                    excerptB: '100% disgorgement required prior to Murabaha execution.',
                    impact: 'Zero profit retained from non-compliant capital.',
                  })
                }
                className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="truncate">
                  <span className="text-emerald-300 font-mono font-medium">AAOIFI-21: </span>
                  <span className="text-slate-300">Taharah KWD 7,900</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal / Popover when user clicks citations */}
      {selectedCitationModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1728] border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCitationModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedCitationModal.ref}
              </span>
              <h3 className="text-sm font-bold text-white">{selectedCitationModal.title}</h3>
            </div>

            <div className="space-y-3 text-xs mt-4">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                  SOURCE A: {selectedCitationModal.sourceA}
                </p>
                <p className="text-slate-200 italic font-serif">
                  "{selectedCitationModal.excerptA}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                  SOURCE B: {selectedCitationModal.sourceB}
                </p>
                <p className="text-slate-200 italic font-serif">
                  "{selectedCitationModal.excerptB}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50">
                <p className="text-[10px] font-mono text-blue-300 uppercase font-semibold mb-1">
                  FORENSIC IMPACT & UNDERWRITING ACTION
                </p>
                <p className="text-blue-100">{selectedCitationModal.impact}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedCitationModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
