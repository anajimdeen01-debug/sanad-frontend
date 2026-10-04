import React, { useState } from 'react';
import { Business, EvaluationPayload } from '../types';
import { 
  GitBranch, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Coins, 
  Building2, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';

interface IslamicTransactionFlowchartProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
}

export const IslamicTransactionFlowchart: React.FC<IslamicTransactionFlowchartProps> = ({
  evaluation,
  selectedBiz,
}) => {
  const [selectedStructure, setSelectedStructure] = useState<'tawarruq' | 'ijara' | 'istisna'>('tawarruq');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const facilityKwd = evaluation.financial_analytics.facilityRequestedKwd;
  const profitMarginPct = 4.25; // 4.25% p.a.
  const tenorMonths = 36;
  const totalProfitKwd = Math.round(facilityKwd * (profitMarginPct / 100) * (tenorMonths / 12));
  const totalDeferredPriceKwd = facilityKwd + totalProfitKwd;
  const monthlyInstallmentKwd = Math.round(totalDeferredPriceKwd / tenorMonths);

  // Tawarruq Steps (Commodity Murabaha)
  const tawarruqSteps = [
    {
      step: 1,
      title: 'Commodity Purchase',
      from: 'Warba Bank Treasury',
      to: 'Commodity Broker A (LME / Bursa)',
      action: `Warba buys certified Shariah-compliant commodities (non-precious metals/palm oil) for spot cash.`,
      cashFlow: `Spot Cash Outflow: KWD ${facilityKwd.toLocaleString()}`,
      shariahRule: 'Ownership & Risk: Warba Bank must bear market and price risk prior to resale. Commodities must physically exist and be certified by warrant certificates.',
      aaoifiRef: 'AAOIFI Standard No. 8 (Murabaha) § 2/1/1',
      badge: 'Step 1: Spot Purchase',
    },
    {
      step: 2,
      title: 'Constructive Possession (Qabd Hukmi)',
      from: 'Commodity Broker A',
      to: 'Warba Bank',
      action: 'Transfer of title and electronic warehouse warrants to Warba Bank.',
      cashFlow: 'Title Perfection & Holding Risk',
      shariahRule: 'Qabd Requirement: The bank takes constructive possession (Qabd Hukmi) with identifiable serial numbers. Prohibition of selling before possession.',
      aaoifiRef: 'AAOIFI Standard No. 30 (Monetization/Tawarruq) § 4/2',
      badge: 'Step 2: Possession (Qabd)',
    },
    {
      step: 3,
      title: 'Deferred Murabaha Sale to Client',
      from: 'Warba Bank',
      to: `${selectedBiz.name}`,
      action: `Warba sells the commodity to the Client on deferred payment terms (Cost: KWD ${facilityKwd.toLocaleString()} + Fixed Profit: KWD ${totalProfitKwd.toLocaleString()}).`,
      cashFlow: `Deferred Receivable: KWD ${totalDeferredPriceKwd.toLocaleString()} over ${tenorMonths} Mos`,
      shariahRule: 'Transparent Markup: Cost and profit mark-up must be strictly disclosed. Profit rate cannot fluctuate post-contract signature.',
      aaoifiRef: 'AAOIFI Standard No. 8 § 3/1/2',
      badge: 'Step 3: Murabaha Sale',
    },
    {
      step: 4,
      title: 'Monetization for Immediate Liquidity',
      from: `${selectedBiz.name}`,
      to: 'Independent Broker B',
      action: 'Client sells commodity to an independent third-party broker for immediate spot cash to fund operations.',
      cashFlow: `Immediate Cash Liquidity to Client: KWD ${facilityKwd.toLocaleString()}`,
      shariahRule: 'Prohibition of Bay\' al-Inah: Broker B must be completely independent of Broker A and Warba Bank. No buy-back arrangements permitted.',
      aaoifiRef: 'AAOIFI Standard No. 30 § 5/1',
      badge: 'Step 4: Liquidity Release',
    },
    {
      step: 5,
      title: 'Amortizing Repayment Back to Bank',
      from: `${selectedBiz.name}`,
      to: 'Warba Bank',
      action: `Client repays the deferred sale price via regular amortizing installments backed by pledged collateral.`,
      cashFlow: `Monthly Installment: KWD ${monthlyInstallmentKwd.toLocaleString()} / mo`,
      shariahRule: 'Late Payment Penalty: No compounding interest. Any late payment compensation must be irrevocably routed to designated charities.',
      aaoifiRef: 'AAOIFI Standard No. 8 § 5/6',
      badge: 'Step 5: Amortization',
    },
  ];

  // Ijara Steps (Lease to Own)
  const ijaraSteps = [
    {
      step: 1,
      title: 'Asset Acquisition',
      from: 'Vendor / Developer',
      to: 'Warba Bank',
      action: `Warba Bank acquires legal title of identified real estate or equipment for KWD ${facilityKwd.toLocaleString()}.`,
      cashFlow: `Asset Purchase: KWD ${facilityKwd.toLocaleString()}`,
      shariahRule: 'Usufruct & Ownership: Bank retains ownership of the leased asset and bears major structural maintenance risk.',
      aaoifiRef: 'AAOIFI Standard No. 9 (Ijarah)',
      badge: 'Step 1: Asset Ownership',
    },
    {
      step: 2,
      title: 'Ijara Lease Agreement',
      from: 'Warba Bank',
      to: `${selectedBiz.name}`,
      action: `Bank leases asset to Client for agreed monthly rental payments linked to CBK benchmark.`,
      cashFlow: `Periodic Lease Rental: KWD ${monthlyInstallmentKwd.toLocaleString()} / mo`,
      shariahRule: 'Variable Rental Permissible: Rental rate can be pegged to a known benchmark (e.g. CBK discount rate) with ceiling and floor.',
      aaoifiRef: 'AAOIFI Standard No. 9 § 5/2',
      badge: 'Step 2: Leasehold',
    },
    {
      step: 3,
      title: 'Ownership Transfer (Tamleek)',
      from: 'Warba Bank',
      to: `${selectedBiz.name}`,
      action: 'Upon completion of all lease payments, legal title transfers to Client via gift (Hibah) or nominal sale.',
      cashFlow: 'Final Title Transfer: KWD 1 (Nominal)',
      shariahRule: 'Separation of Contracts: The promise to transfer ownership must be in a separate document from the lease agreement.',
      aaoifiRef: 'AAOIFI Standard No. 9 § 8/1',
      badge: 'Step 3: Title Transfer',
    },
  ];

  const currentSteps = selectedStructure === 'tawarruq' ? tawarruqSteps : ijaraSteps;
  const activeStep = currentSteps[activeStepIndex] || currentSteps[0];

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-emerald-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Islamic Transaction Flowchart</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-500/30">
                  Interactive Shariah Steps
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing possession (*Qabd*), commodity monetization, and deferred price amortizing mechanics.
              </p>
            </div>
          </div>

          {/* Structure Selector */}
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => {
                setSelectedStructure('tawarruq');
                setActiveStepIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedStructure === 'tawarruq'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Murabaha / Tawarruq
            </button>
            <button
              onClick={() => {
                setSelectedStructure('ijara');
                setActiveStepIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedStructure === 'ijara'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ijara Muntahiya
            </button>
          </div>
        </div>

        {/* Step Nodes Bar */}
        <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {currentSteps.map((stepItem, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex-1 min-w-[100px] p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-950/60 border-emerald-500/50 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    0{stepItem.step}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'}`} />
                </div>
                <p className={`text-xs font-bold mt-1 truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {stepItem.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {stepItem.from.split(' ')[0]} ➔ {stepItem.to.split(' ')[0]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Visual Interactive Step Detail Canvas */}
        <div className="mt-3 bg-slate-950/80 rounded-xl p-4 border border-white/10 space-y-3 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              {activeStep.badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {activeStep.aaoifiRef}
            </span>
          </div>

          {/* Interactive Flow visualization diagram */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Origin Node */}
            <div className="w-full sm:w-5/12 bg-slate-950 p-2.5 rounded-lg border border-blue-500/20 text-center space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Transferor / Origin</span>
              <p className="text-xs font-bold text-white truncate">{activeStep.from}</p>
            </div>

            {/* Connecting Dynamic Flow Arrow with Cashflow Badge */}
            <div className="flex flex-col items-center justify-center shrink-0 px-2 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 whitespace-nowrap">
                {activeStep.cashFlow}
              </span>
              <div className="flex items-center text-emerald-400">
                <span className="h-0.5 w-12 bg-emerald-500/50 hidden sm:block" />
                <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Destination Node */}
            <div className="w-full sm:w-5/12 bg-slate-950 p-2.5 rounded-lg border border-teal-500/20 text-center space-y-1">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">Transferee / Recipient</span>
              <p className="text-xs font-bold text-white truncate">{activeStep.to}</p>
            </div>

          </div>

          {/* Action & Shariah Principle Proof */}
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Execution Mechanism:</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed">{activeStep.action}</p>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-lg p-2.5 text-[11px] text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mandatory Shariah Governance Invariant:</span>
              </div>
              <p className="italic leading-relaxed text-slate-300">
                "{activeStep.shariahRule}"
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Pricing Summary */}
      <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-white/5">
          <span className="text-[10px] text-slate-400 block">Principal (KWD)</span>
          <span className="font-mono font-bold text-white">{(facilityKwd / 1000).toLocaleString()}k</span>
        </div>
        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-white/5">
          <span className="text-[10px] text-slate-400 block">Murabaha Margin</span>
          <span className="font-mono font-bold text-emerald-400">+{profitMarginPct}% p.a.</span>
        </div>
        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-white/5">
          <span className="text-[10px] text-slate-400 block">Total Deferred</span>
          <span className="font-mono font-bold text-blue-400">{(totalDeferredPriceKwd / 1000).toLocaleString()}k</span>
        </div>
        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-white/5">
          <span className="text-[10px] text-slate-400 block">Tenor</span>
          <span className="font-mono font-bold text-amber-400">{tenorMonths} Months</span>
        </div>
      </div>

    </div>
  );
};
