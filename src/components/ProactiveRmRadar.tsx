import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Clock, ArrowRight, ShieldCheck, Zap, FileText } from 'lucide-react';
import { Business } from '../types';

interface ProactiveAlert {
  id: string;
  type: 'renewal_upsize' | 'cross_sell' | 'covenant_alert';
  title: string;
  clientName: string;
  crNumber: string;
  description: string;
  quantitativeImpact: string;
  recommendedAction: string;
  urgency: 'high' | 'medium' | 'opportunity';
}

interface ProactiveRmRadarProps {
  onSelectClientAndDoc: (crNumber: string, docType: 'cam' | 'term_sheet' | 'rm_brief') => void;
  lang?: 'en' | 'ar';
}

export const ProactiveRmRadar: React.FC<ProactiveRmRadarProps> = ({
  onSelectClientAndDoc,
  lang = 'en',
}) => {
  const alerts: ProactiveAlert[] = [
    {
      id: 'alert_1',
      type: 'renewal_upsize',
      title: 'Facility Maturity in 55 Days · Proactive Renewal & Upsize Opportunity',
      clientName: 'Al-Manar Industrial',
      crNumber: 'CR-892410-KW',
      description: 'Murabaha working capital line of KWD 1.8M matures in 55 days. Customer revenue expanded +14.8% YoY with healthy 2.45x DSCR. Recommended to proactively pitch an upsized KWD 2.5M facility before competitor banks intervene.',
      quantitativeImpact: '+KWD 700,000 Expansion Envelope · Est. Bank Margin KWD 39,375 p.a.',
      recommendedAction: 'Auto-Draft Early Renewal CAM & Term Sheet',
      urgency: 'opportunity',
    },
    {
      id: 'alert_2',
      type: 'cross_sell',
      title: 'Supply Chain Trade Finance Expansion Trigger',
      clientName: 'Gulf Pearl Logistics',
      crNumber: 'CR-451290-KW',
      description: 'Finacle transactional data reveals monthly overseas vendor transfers exceeding KWD 420,000. Customer qualifies for a dedicated Import Letter of Credit (LC) / Murabaha facility.',
      quantitativeImpact: 'KWD 850,000 New Trade Line · Est. Fee Income KWD 12,500',
      recommendedAction: 'Auto-Draft Trade Finance Pitch & RM Brief',
      urgency: 'medium',
    },
    {
      id: 'alert_3',
      type: 'covenant_alert',
      title: 'Proactive Forensic Risk Alert: CiNet Mortgage Detected',
      clientName: 'Qabas Trading Co.',
      crNumber: 'CR-1149204-KW',
      description: 'Central Bank CiNet bureau update flagged a KWD 1.45M third-party mortgage on Plot 88-C conflicting with borrower commercial registry filings. Immediate relationship intervention required prior to upcoming quarterly review.',
      quantitativeImpact: 'Exposure at Risk: KWD 1,450,000 · Collateral Priority Conflict',
      recommendedAction: 'Auto-Draft Remediation Notice & CFO Meeting Brief',
      urgency: 'high',
    },
  ];

  return (
    <div className="bg-[#0A0E17] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Front Office AI Transformation: Reactive → Proactive</span>
          </div>
          <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
            Proactive Front-Office RM Intelligence Radar
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-2xl">
            Continuously scans customer cash flow velocity, maturing facilities, and registry updates to deliver 
            actionable relationship management briefs and pre-drafted client proposals.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">Proactive Portfolio Coverage</span>
          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded border border-emerald-500/30 inline-block">
            3 High-Priority Actions Detected
          </span>
        </div>
      </div>

      {/* Actionable Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const isHigh = alert.urgency === 'high';
          const isOpp = alert.urgency === 'opportunity';
          return (
            <div
              key={alert.id}
              className={`rounded-xl p-5 border flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                isHigh
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                  : isOpp
                  ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50'
              }`}
            >
              <div className="space-y-3">
                
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isHigh
                      ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                      : isOpp
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-blue-950 text-blue-300 border-blue-500/40'
                  }`}>
                    {isHigh ? 'RISK INTERVENTION' : isOpp ? 'PROACTIVE UPSELL' : 'CROSS-SELL EXPANSION'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{alert.crNumber}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    {alert.clientName}
                  </h4>
                  <h3 className="text-sm font-semibold text-white mt-0.5 leading-snug">
                    {alert.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {alert.description}
                </p>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono">
                  <span className="text-slate-500 block text-[10px]">QUANTITATIVE UPSIDE / IMPACT:</span>
                  <span className={isHigh ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {alert.quantitativeImpact}
                  </span>
                </div>

              </div>

              {/* 1-Click Action Button */}
              <button
                onClick={() => {
                  const targetDoc = isHigh ? 'rm_brief' : isOpp ? 'cam' : 'term_sheet';
                  onSelectClientAndDoc(alert.crNumber, targetDoc);
                }}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  isHigh
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                    : isOpp
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40'
                }`}
              >
                <span>{alert.recommendedAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
