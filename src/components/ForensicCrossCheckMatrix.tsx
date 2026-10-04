import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  FileText, 
  ArrowRightLeft, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  ExternalLink,
  Split,
  Eye
} from 'lucide-react';

interface ForensicCrossCheckMatrixProps {
  onOpenSideBySideModal?: () => void;
}

interface ConflictCase {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  deltaLabel: string;
  docAName: string;
  docALines: { lineNum: number; text: string; isDanger?: boolean }[];
  docBName: string;
  docBLines: { lineNum: number; text: string; isDanger?: boolean }[];
  connectedPair: { aLineIndex: number; bLineIndex: number };
  forensicAnalysis: string;
  committeeMandate: string;
}

export const ForensicCrossCheckMatrix: React.FC<ForensicCrossCheckMatrixProps> = ({
  onOpenSideBySideModal,
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>('mortgage');

  const cases: ConflictCase[] = [
    {
      id: 'mortgage',
      title: 'Undisclosed Commercial Mortgage on Shuwaikh Industrial Plot 18-A',
      severity: 'critical',
      deltaLabel: 'KWD 420,000 Unreported Prior Lien',
      docAName: 'MOCI Commercial Registry #1048291 (Declared Pledges)',
      docALines: [
        { lineNum: 21, text: '2.1 Corporate Real Estate Assets & Permitted Pledges' },
        { lineNum: 22, text: 'Registered Asset: Plot 18-A Shuwaikh Industrial Depot (Area: 4,200 sqm).' },
        { lineNum: 23, text: 'AFFIDAVIT: Property is free, clear, and unencumbered by any third-party liens, mortgages, or bank debentures.', isDanger: true },
        { lineNum: 24, text: 'Authorized Signatory: Fahad Al-Mutawa (Managing Director).' },
        { lineNum: 25, text: 'Certified by Ministry of Commerce & Industry Records Dept.' },
      ],
      docBName: 'Central Bank of Kuwait (CBK) Credit Bureau Ledger (Ci-Net)',
      docBLines: [
        { lineNum: 84, text: 'CBK SCHEDULE C: Active Pledges & Institutional Mortgages' },
        { lineNum: 85, text: 'Borrower ID: 1048291 · Lending Institution: National Commercial Bank' },
        { lineNum: 86, text: 'FACILITY REF #NBK-MORT-891: Registered 1st Degree Senior Mortgage on Plot 18-A Shuwaikh Industrial.', isDanger: true },
        { lineNum: 87, text: 'Current Outstanding Principal Lien: KWD 420,000. Maturity: November 2028.', isDanger: true },
        { lineNum: 88, text: 'Status: Active and in good standing with senior priority claim.' },
      ],
      connectedPair: { aLineIndex: 2, bLineIndex: 2 },
      forensicAnalysis: 'Direct contradiction between borrower sworn affidavit and Central Bank regulatory records. Proposed collateral cannot provide first-degree security to Warba Bank.',
      committeeMandate: 'REJECT or SUSPEND facility until borrower provides notarized mortgage discharge deed and revised clean title deed from Ministry of Justice.',
    },
    {
      id: 'revenue',
      title: 'Audited Turnover Overstatement vs. Verified Bank Inflows',
      severity: 'high',
      deltaLabel: '-12.1% (KWD 1,360,000 Variance)',
      docAName: 'Audited Financial Statements FY2025 (P&L Income Statement)',
      docALines: [
        { lineNum: 14, text: 'STATEMENT OF COMPREHENSIVE INCOME FOR THE YEAR ENDED' },
        { lineNum: 15, text: 'Operating Revenue: Sea Freight Logistics & Shuwaikh Berth Operations.' },
        { lineNum: 16, text: 'Reported Gross Annual Turnover: KWD 11,200,000 (Certified by Auditor Note 4).', isDanger: true },
        { lineNum: 17, text: 'Cost of Sales: (KWD 7,420,000) · Gross Margin: 33.7%.' },
        { lineNum: 18, text: 'Net Operating Income: KWD 1,320,000.' },
      ],
      docBName: '12-Month Corporate Operating Bank Statements (Warba & Clearing Accounts)',
      docBLines: [
        { lineNum: 42, text: '12-MONTH TRAILING INFLOW RECONCILIATION SUMMARY' },
        { lineNum: 43, text: 'Total Customer Inward Wires & RTGS Credits: KWD 8,410,200' },
        { lineNum: 44, text: 'Commercial Clearing Cheques Deposited: KWD 1,429,910' },
        { lineNum: 45, text: 'TOTAL AGGREGATE CASH INFLOWS: KWD 9,840,110 (Unreconciled deficit of KWD 1,359,890).', isDanger: true },
        { lineNum: 46, text: 'Auditor confirmation requested for circularized receivables balance.' },
      ],
      connectedPair: { aLineIndex: 2, bLineIndex: 3 },
      forensicAnalysis: 'Top-line revenue reported to underwriters exceeds actual corporate treasury inflows by over 12%. Indicates potential aggressive revenue recognition or fictitious invoices.',
      committeeMandate: 'Require auditor circularization of top 5 customer receivable balances and escrow assignment of verified corporate receivables.',
    },
    {
      id: 'lease',
      title: 'Off-Balance-Sheet Vessel Operating Lease Omission',
      severity: 'medium',
      deltaLabel: 'KWD 180,000 Annual Unrecorded Obligation',
      docAName: 'Audited Accounts Note 14 (Capital Commitments)',
      docALines: [
        { lineNum: 38, text: 'NOTE 14: COMMITMENTS & CONTINGENT LIABILITIES' },
        { lineNum: 39, text: 'The group had no material capital commitments at year end.' },
        { lineNum: 40, text: 'Operating leases commitments expiring within one year: Nil. Over five years: Nil.', isDanger: true },
        { lineNum: 41, text: 'Approved on behalf of the Board of Directors.' },
      ],
      docBName: 'Port Authority Shuwaikh Berth Charter Agreement',
      docBLines: [
        { lineNum: 12, text: 'ARTICLE 6: FIXED TERM VESSEL BERTHING CHARTER' },
        { lineNum: 13, text: 'Continuous irrevocable berth reservation for Tugboat Al-Wataniya.' },
        { lineNum: 14, text: 'Monthly Berth Charter Fee: KWD 15,000 (Annual Obligation: KWD 180,000 continuous through Dec 2027).', isDanger: true },
        { lineNum: 15, text: 'Default penalty: Immediate port seizure of floating equipment.' },
      ],
      connectedPair: { aLineIndex: 2, bLineIndex: 2 },
      forensicAnalysis: 'Irrevocable charter obligations omitted from note disclosures, artificially flattering operating margin and DSCR debt service calculations.',
      committeeMandate: 'Adjust normalized EBITDA downward by KWD 180,000 annually in underwriting model.',
    },
  ];

  const currentCase = cases.find(c => c.id === activeCaseId) || cases[0];

  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full group hover:border-rose-500/20 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Forensic Cross-Check Visual Matrix</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                  Visual Danger Connectors
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Interactive side-by-side legal document audit displaying connecting visual discrepancy vectors.
              </p>
            </div>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {cases.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  activeCaseId === c.id
                    ? c.severity === 'critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/50 shadow-sm'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {c.id === 'mortgage' ? '🔴 Undisclosed Mortgage' : c.id === 'revenue' ? '🟡 Revenue Inflow Deficit' : '🟡 Lease Omission'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Discrepancy Highlight Banner */}
        <div className="mt-3 bg-slate-950/90 rounded-xl p-3 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertOctagon className={`w-4 h-4 shrink-0 ${currentCase.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />
            <div>
              <span className="text-xs font-bold text-white block">{currentCase.title}</span>
              <span className="text-[10px] text-slate-400">{currentCase.forensicAnalysis}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
              {currentCase.deltaLabel}
            </span>
          </div>
        </div>

        {/* Visual Side-by-Side Matrix with Danger Connectors */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          
          {/* Document A Column */}
          <div className="bg-slate-950/70 rounded-xl border border-blue-500/20 p-3.5 space-y-2 relative">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-blue-300 flex items-center gap-1.5 truncate max-w-[280px]">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentCase.docAName}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                Doc A (Declared)
              </span>
            </div>

            {/* Document Lines */}
            <div className="space-y-1 font-mono text-[11px]">
              {currentCase.docALines.map((l, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-1.5 rounded transition-colors ${
                    l.isDanger
                      ? 'bg-rose-950/30 text-rose-200 border-l-2 border-rose-500 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none text-[10px] w-5 shrink-0 text-right">
                    {l.lineNum}
                  </span>
                  <span className="leading-snug">{l.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document B Column */}
          <div className="bg-slate-950/70 rounded-xl border border-rose-500/30 p-3.5 space-y-2 relative shadow-lg shadow-rose-950/10">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-rose-300 flex items-center gap-1.5 truncate max-w-[280px]">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentCase.docBName}</span>
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                Doc B (Verified Record)
              </span>
            </div>

            {/* Document Lines */}
            <div className="space-y-1 font-mono text-[11px]">
              {currentCase.docBLines.map((l, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-1.5 rounded transition-colors ${
                    l.isDanger
                      ? 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500 font-semibold ring-1 ring-rose-500/20'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none text-[10px] w-5 shrink-0 text-right">
                    {l.lineNum}
                  </span>
                  <span className="leading-snug">{l.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Credit Committee Directive Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="font-semibold text-purple-300">Sanad Committee Directive:</span>
          <span className="text-slate-400 italic">{currentCase.committeeMandate}</span>
        </div>
        <div className="shrink-0 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Cross-Verified via SHA-256 Ledger</span>
        </div>
      </div>

    </div>
  );
};
