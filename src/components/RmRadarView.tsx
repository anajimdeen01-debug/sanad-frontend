/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radar, 
  Filter, 
  Settings, 
  Download, 
  ArrowRight, 
  AlertTriangle, 
  TrendingUp, 
  MoreVertical,
  HelpCircle,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Business } from '../types';

interface RmRadarViewProps {
  onSelectBusiness?: (bizId: string) => void;
  showToast?: (msg: string) => void;
}

export const RmRadarView: React.FC<RmRadarViewProps> = ({
  onSelectBusiness,
  showToast,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleActionClick = (actionName: string, bizId?: string) => {
    setActiveModal(actionName);
    if (showToast) showToast(`Generated: ${actionName}`);
    if (bizId && onSelectBusiness) {
      onSelectBusiness(bizId);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c16] text-slate-200 font-sans p-6 sm:p-8 space-y-8">
      {/* Header matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Proactive RM Intelligence Radar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scanning cash flow velocity and facility registry updates across Kuwait banking sector.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SCANNING ACTIVE</span>
          </div>

          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RM Opportunities & Risks Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                RM Opportunities & Risks
              </h2>
              <p className="text-xs text-slate-400">
                3 High-Priority Actions Detected Across Portfolio
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.print();
              if (showToast) showToast('Exporting RM Radar intelligence report...');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#0d1728] hover:bg-[#122036] border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* 3 High-Priority Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: AL-MANAR INDUSTRIAL (Upsell) */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  PROACTIVE UPSELL
                </span>
                <span className="text-[10px] font-mono text-slate-400">CR-892418-KW</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  AL-MANAR INDUSTRIAL
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  Facility Maturity in 55 Days · Proactive Renewal & Upsize Opportunity
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Murabaha working capital line of KWD 1.8M matures in 55 days. Customer revenue expanded +14.8% YoY with healthy 2.45x DSCR. Recommended to proactively pitch an upsized KWD 2.5M facility before competitor banks intervene.
              </p>

              <div className="bg-[#08101d] border border-slate-800 rounded-xl p-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  QUANTITATIVE UPSIDE
                </p>
                <p className="text-xs font-bold text-emerald-400 font-mono">
                  +KWD 700,000 <span className="text-slate-300 font-sans font-medium text-[11px]">EXPANSION</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Est. Bank Margin <strong className="text-slate-200">KWD 39,375 p.a.</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleActionClick('CAM & Term Sheet for Al-Manar Industrial', 'biz_manar')}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
            >
              <span>AUTO-DRAFT CAM & TERM SHEET</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: GULF PEARL LOGISTICS (Cross-Sell) */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  CROSS-SELL EXPANSION
                </span>
                <span className="text-[10px] font-mono text-slate-400">CR-451290-KW</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  GULF PEARL LOGISTICS
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  Supply Chain Trade Finance Expansion Trigger
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Finacle transactional data reveals monthly overseas vendor transfers exceeding KWD 420,000. Customer qualifies for a dedicated Import Letter of Credit (LC) / Murabaha facility.
              </p>

              <div className="bg-[#08101d] border border-slate-800 rounded-xl p-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  MARKET OPPORTUNITY
                </p>
                <p className="text-xs font-bold text-blue-400 font-mono">
                  KWD 850,000 <span className="text-slate-300 font-sans font-medium text-[11px]">TRADE LINE</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Est. Fee Income <strong className="text-slate-200">KWD 12,500</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleActionClick('Pitch & RM Brief for Gulf Pearl Logistics', 'biz_pearl')}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
            >
              <span>AUTO-DRAFT PITCH & RM BRIEF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: QABAS TRADING CO. (Risk Intervention) */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                  RISK INTERVENTION
                </span>
                <span className="text-[10px] font-mono text-slate-400">CR-1149204-KW</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  QABAS TRADING CO.
                </h3>
                <p className="text-[11px] text-rose-300 font-medium mt-0.5">
                  Proactive Risk Alert: CiNet Mortgage Detected
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Central Bank CiNet bureau update flagged a KWD 1.45M third-party mortgage on Plot 88-C conflicting with borrower commercial registry filings. Immediate relationship intervention required.
              </p>

              <div className="bg-[#08101d] border border-slate-800 rounded-xl p-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  EXPOSURE AT RISK
                </p>
                <p className="text-xs font-bold text-rose-400 font-mono">
                  KWD 1,450,000
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  <strong className="text-rose-300">COLLATERAL CONFLICT</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleActionClick('Remediation Notice for Qabas Trading', 'biz_qabas')}
              className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-rose-600/20"
            >
              <span>AUTO-DRAFT REMEDIATION NOTICE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Intelligence Feed */}
      <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Portfolio Intelligence Feed
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">ENTITY & SECTOR</th>
                <th className="pb-3 font-semibold">SIGNAL TYPE</th>
                <th className="pb-3 font-semibold">CONFIDENCE</th>
                <th className="pb-3 font-semibold">IMPACT SCORE</th>
                <th className="pb-3 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                      BT
                    </div>
                    <div>
                      <p className="font-semibold text-white">BlueTech Systems</p>
                      <p className="text-[10px] text-slate-400">Technology / IT Services</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 pr-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    CASH FLOW VELOCITY (+)
                  </span>
                </td>

                <td className="py-3.5 pr-4 font-mono font-bold text-white">
                  94%
                </td>

                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-1.5 rounded-sm bg-emerald-400" />
                    <div className="w-3.5 h-1.5 rounded-sm bg-emerald-400" />
                    <div className="w-3.5 h-1.5 rounded-sm bg-emerald-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                </td>

                <td className="py-3.5 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                      KF
                    </div>
                    <div>
                      <p className="font-semibold text-white">Kuwait Foodies Group</p>
                      <p className="text-[10px] text-slate-400">Retail / F&B</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 pr-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    REGISTRY UPDATE (MOCI)
                  </span>
                </td>

                <td className="py-3.5 pr-4 font-mono font-bold text-white">
                  88%
                </td>

                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-1.5 rounded-sm bg-blue-400" />
                    <div className="w-3.5 h-1.5 rounded-sm bg-blue-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                </td>

                <td className="py-3.5 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action modal preview */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1728] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Autonomous RM Dispatch Perfected</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Auto-drafted dossier: <strong className="text-white">{activeModal}</strong>. Prepared using real-time Finacle and Ministry telemetry according to Warba Institutional Banking parameters.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
