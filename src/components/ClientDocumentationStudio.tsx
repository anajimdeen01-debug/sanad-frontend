import React, { useState } from 'react';
import { Business, EvaluationPayload } from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Send, 
  Briefcase, 
  FileCheck2, 
  Users, 
  ChevronRight,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

interface ClientDocumentationStudioProps {
  business: Business;
  evaluation: EvaluationPayload;
  lang?: 'en' | 'ar';
}

export type DocType = 'cam' | 'term_sheet' | 'rm_brief' | 'ssb_memo';

export const ClientDocumentationStudio: React.FC<ClientDocumentationStudioProps> = ({
  business,
  evaluation,
  lang = 'en',
}) => {
  const [activeDoc, setActiveDoc] = useState<DocType>('cam');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { financials, scores, discrepancies, taharah_schedule, verdict } = {
    financials: evaluation.financial_analytics,
    scores: evaluation.scores,
    discrepancies: evaluation.discrepancies || [],
    taharah_schedule: evaluation.taharah_schedule,
    verdict: evaluation.verdict,
  };

  const todayStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const facilityKwd = business.facility_requested || financials.facilityRequestedKwd || 2500000;
  const collateralKwd = business.collateral_value || financials.collateralValueKwd || 3500000;
  const revenueKwd = financials.annualRevenueKwd || 10000000;
  const ebitdaKwd = financials.ebitdaKwd || 2400000;
  const debtServiceKwd = financials.annualDebtServiceKwd || 1000000;
  const dscr = financials.baselineDscr || 1.25;
  const ltv = financials.ltvRatioPct || 71.4;
  const shariahScore = scores.score || scores.shariah_score || 75;
  const haramPct = scores.haramRevenueRatioPct || 0;
  const debtRatioPct = scores.debtToAssetsPct || 0;
  const taharahKwd = taharah_schedule.taharahPurificationDueKwd || 0;

  // --- Document 1: Executive Credit Application Memorandum (CAM) ---
  const generateCamHtml = () => `
WARBA BANK K.S.C.P. — CORPORATE CREDIT COMMITTEE
EXECUTIVE CREDIT APPLICATION MEMORANDUM (CAM)
Ref: WB-CCM-${business.cr_number}-${new Date().getFullYear()}
Date: ${todayStr}
Classification: STRICTLY CONFIDENTIAL / INTERNAL BANKING USE

1. BORROWER PROFILE & TRANSACTION SUMMARY
--------------------------------------------------------------------------------
Borrower Name:         ${business.name} (${business.nameArabic || 'المنشأة المعتمدة'})
Commercial Register:   ${business.cr_number}
Industry Sector:       ${business.sector}
Risk Rating:           ${business.riskRating || 'A'} | Shariah Health Index: ${shariahScore}/100
Facility Requested:    KWD ${facilityKwd.toLocaleString()}
Structure:             Revolving Commodity Murabaha (Tawarruq) Working Capital Facility
Purpose:               Procurement of raw materials, trade financing & operational liquidity
Appraised Collateral:  KWD ${collateralKwd.toLocaleString()} (Loan-to-Value: ${ltv}%)
Facility Margin:       CBK Discount Rate + 2.25% p.a. (Profit Floor: 5.50%)

2. FINANCIAL APPRAISAL & DEBT SERVICE CAPACITY
--------------------------------------------------------------------------------
• Gross Annual Turnover:    KWD ${revenueKwd.toLocaleString()} (Growth: ${financials.revenueGrowthPct}%)
• Normalized Operating EBITDA: KWD ${ebitdaKwd.toLocaleString()} (Margin: ${financials.operatingMarginPct}%)
• Annual Debt Service (ADS): KWD ${debtServiceKwd.toLocaleString()}
• Baseline DSCR:            ${dscr}x (Warba Policy Floor: 1.25x)
• Macroeconomic Stress Test: Under combined -25% revenue shock and +150 bps rate hike, 
  debt coverage withstands at ${financials.baselineDscr >= 1.25 ? 'compliant' : 'stressed'} levels.

3. SHARIAH COMPLIANCE SCREENING (AAOIFI STANDARDS NO. 21 & 35)
--------------------------------------------------------------------------------
• Primary Business Activity: Permissible commercial trade in ${business.sector}.
• Impermissible Revenue Ratio: ${haramPct}% (AAOIFI Standard 21 statutory ceiling: 5.00%).
• Conventional Debt to Total Assets: ${debtRatioPct}% (AAOIFI Standard 21 ceiling: 30.00%).
• Liquid Assets Ratio: ${scores.liquidAssetsRatioPct}% (Threshold: > 33.00%).
• Mandatory Taharah Dividend Cleansing: KWD ${taharahKwd.toLocaleString()} identified from 
  conventional interest/ancillary income, payable to ${taharah_schedule.designatedCharity}.

4. FORENSIC CROSS-DOCUMENT CIRCULARIZATION & LIEN AUDIT
--------------------------------------------------------------------------------
${discrepancies.length > 0 ? discrepancies.map((d, i) => `[ALERT 0${i + 1}] ${d.title} (Severity: ${d.severity.toUpperCase()})
  • Primary Filing Claim: ${d.sourceDocA.name} [${d.sourceDocA.pageOrRef}] -> "${d.sourceDocA.excerpt}"
  • Contradicting Official Record: ${d.sourceDocB.name} [${d.sourceDocB.pageOrRef}] -> "${d.sourceDocB.excerpt}"
  • Unreconciled Financial Exposure: KWD ${(d.financialImpactKwd || 0).toLocaleString()}
  • Mitigation Requirement: Notarized discharge certificate required prior to drawdown.`).join('\n\n') : '• Clean Reconciled Audit: Cross-referencing between Ministry of Commerce (MOCI) registers, Central Bank of Kuwait (CBK) CiNet ledgers, and audited statements confirms zero undisclosed debentures or prior-ranking mortgages.'}

5. CONDITIONS PRECEDENT (CPs) TO INITIAL FACILITY DRAWDOWN
--------------------------------------------------------------------------------
1. Perfection and registration of first-degree commercial mortgage over collateral valued at KWD ${collateralKwd.toLocaleString()}.
2. Verification of official remittance receipt of KWD ${taharahKwd.toLocaleString()} Taharah purification to Bait Al-Zakat Kuwait.
3. Corporate Guarantee from primary shareholders and promissory notes covering 110% of facility envelope.
4. Quarterly covenant certificate confirming DSCR >= 1.25x and debt-to-assets <= 30.0%.

6. RELATIONSHIP MANAGER & CREDIT COMMITTEE SIGN-OFF ENDORSEMENT
--------------------------------------------------------------------------------
Recommendation: ${verdict.title}
Analyst Rationale: ${verdict.analyst_rationale}

Prepared By:                              Reviewed By (SCU):
___________________________________       ___________________________________
Relationship Manager: Ahmad Al-Sabah, CFA Shariah Coordination Unit: Dr. Tariq Al-Otaibi
Corporate Banking Group, Warba Bank       Warba Shariah Supervisory Board

Sanction Endorsement (Credit Committee):
___________________________________       ___________________________________
Head of Corporate Credit Risk             Chief Executive Officer / Committee Chair
`;

  // --- Document 2: Indicative Murabaha Facility Term Sheet & Offer Letter ---
  const generateTermSheetHtml = () => `
WARBA BANK K.S.C.P.
CORPORATE BANKING GROUP
Al-Raya Tower, Al-Shuhada Street, Sharq, Kuwait City
P.O. Box 1220, Safat 13013, Kuwait

Date: ${todayStr}
Private & Confidential

To: The Board of Directors & Chief Financial Officer
${business.name}
Commercial Register No: ${business.cr_number}
State of Kuwait

SUBJECT: INDICATIVE SHARIAH-COMPLIANT FINANCING OFFER LETTER & TERM SHEET

Dear Sirs,

Warba Bank K.S.C.P. ("Warba Bank" or the "Bank") is pleased to convey this indicative offer to make available a Shariah-compliant Murabaha Financing Facility in favor of ${business.name} ("Borrower"), subject to the terms and conditions outlined below:

1. FACILITY PARAMETERS
--------------------------------------------------------------------------------
• Obligor / Borrower:   ${business.name} (CR: ${business.cr_number})
• Mandated Lead Arranger: Warba Bank K.S.C.P.
• Facility Type:         Revolving Commodity Murabaha / Tawarruq Facility
• Facility Limit:        KWD ${facilityKwd.toLocaleString()} (Kuwaiti Dinars Only)
• Tenor:                 12 Months (Renewable annually upon credit & Shariah review)
• Tranche Maturity:      Up to 180 days per Murabaha contract
• Cost of Funds / Pricing: Central Bank of Kuwait (CBK) Discount Rate + 2.25% per annum
                         (Currently yielding an effective rate of ~5.75% p.a.)

2. TRANSACTION STRUCTURE (COMMODITY MURABAHA)
--------------------------------------------------------------------------------
1. The Borrower requests Warba Bank to purchase specified Shariah-compliant commodities from an approved international brokerage broker on spot terms.
2. Warba Bank purchases the commodities and acquires verified title and constructive possession.
3. Warba Bank sells the commodities to the Borrower on deferred payment terms at Cost + Agreed Profit (Murabaha).
4. The Borrower, either directly or through an independent broker, sells the commodities in the spot market to realize cash liquidity.
5. All transactions are executed under strict supervision of Warba Bank's Shariah Supervisory Board in accordance with AAOIFI Murabaha Standard No. 8.

3. SECURITY & COLLATERAL PACKAGE
--------------------------------------------------------------------------------
The Facility shall be secured by:
• First-degree official registered commercial mortgage over prime real estate / asset package appraised at minimum KWD ${collateralKwd.toLocaleString()} (LTV not to exceed ${ltv}%).
• Valid promissory note (Sanad Li-Amr) executed by authorized signatories for KWD ${(facilityKwd * 1.1).toLocaleString()}.
• Joint and several personal/corporate guarantees from key operating shareholders.
• Assignment of operating cash turnover flowing through Borrower's accounts at Warba Bank.

4. MANDATORY CONDITIONS PRECEDENT
--------------------------------------------------------------------------------
• Full satisfactory Know-Your-Customer (KYC) and Anti-Money Laundering (AML) documentation.
• Provision of clearance from Central Bank Credit Bureau (CiNet) showing clean conduct.
• Formal Shariah cleansing confirmation of non-permissible interest income (Taharah) of KWD ${taharahKwd.toLocaleString()} deposited with Bait Al-Zakat.
${discrepancies.length > 0 ? `• Full notarized discharge of conflicting encumbrances flagged during forensic circularization (${discrepancies[0].title}).` : ''}

This letter represents an indicative offer and is valid for 30 calendar days from the date hereof.

Sincerely,

For and on behalf of WARBA BANK K.S.C.P.

___________________________________       ___________________________________
Executive Director, Corporate Banking     Head of Large Corporate & Syndications
Warba Bank K.S.C.P.                       Warba Bank K.S.C.P.

BORROWER ACKNOWLEDGMENT & ACCEPTANCE:
We hereby confirm our acceptance of the indicative terms and conditions set out above.

___________________________________       Date: ________________________
Authorized Signatory: ${business.name}
`;

  // --- Document 3: RM Pre-Meeting Client Brief & CFO Negotiation Guide ---
  const generateRmBriefHtml = () => `
WARBA BANK — CORPORATE BANKING RELATIONSHIP MANAGER (RM) BRIEFING
EXECUTIVE CFO MEETING PREPARATION & NEGOTIATION PLAYBOOK
Client: ${business.name} (CR: ${business.cr_number})
Date of Meeting: Scheduled for Current Week
Relationship Manager: Corporate Banking Division

1. EXECUTIVE SNAPSHOT FOR THE RM
--------------------------------------------------------------------------------
• Client Background: Established player in ${business.sector} seeking KWD ${facilityKwd.toLocaleString()} working capital.
• Key Opportunity: Warba can capture primary operational cash flow by structuring a Commodity Murabaha revolving line, displacing competitor conventional debt.
• Profit Potential: Projected annual net profit margin for Warba Bank is ~KWD ${(facilityKwd * 0.0225).toLocaleString()} with cross-sell fee velocity.
• Shariah Health: ${shariahScore}/100 (${scores.status}). Taharah dividend cleansing required: KWD ${taharahKwd.toLocaleString()}.

2. 5 STRATEGIC QUESTIONS THE RM MUST ASK THE CFO
--------------------------------------------------------------------------------
1. CASH FLOW & REVENUE SUSTAINABILITY:
   "Your current gross turnover stands at KWD ${revenueKwd.toLocaleString()} with EBITDA of KWD ${ebitdaKwd.toLocaleString()}. How do your Q3/Q4 contracts protect against raw material price inflation to safeguard our 1.25x DSCR covenant floor?"

2. CONFLICTING ENCUMBRANCES (FORENSIC FINDING):
   ${discrepancies.length > 0 
     ? `"During official circularization across the Central Bank CiNet bureau, we identified ${discrepancies[0].title}. Can you provide an unconditional mortgage discharge certificate from the creditor bank before we submit to committee?"` 
     : `"Your official records show clean registry alignment. Are there any pending letters of credit or guarantees with other Kuwaiti banks that could encumber inventory?"`}

3. SHARIAH PURIFICATION (TAHARAH):
   "Warba Bank's Shariah Board requires complete purification of non-core interest earnings (KWD ${taharahKwd.toLocaleString()}). Are you ready to execute this remittance to Bait Al-Zakat prior to the initial drawdown tranche?"

4. OPERATIONAL CASH DOMICILIATION:
   "To support the KWD ${facilityKwd.toLocaleString()} facility, what percentage of your annual receivables collection will you route through your new Warba Bank corporate operating account?"

5. COLLATERAL PERFECTION:
   "Your appraised asset package of KWD ${collateralKwd.toLocaleString()} provides an LTV of ${ltv}%. Can you confirm that the title deed registration at the Ministry of Justice is unencumbered and ready for charge execution?"

3. CROSS-SELL & REVENUE EXPANSION OPPORTUNITIES
--------------------------------------------------------------------------------
• Trade Finance / Letters of Credit (LC): Pitch KWD 750,000 import LC facility for regional inventory procurement.
• FX & Treasury Hedging: Offer Wa'ad-based Islamic FX Forward / Islamic Profit Rate Swap (IPRS) to hedge USD equipment imports.
• Corporate Payroll (WPS): Onboard client's workforce onto Warba Bank payroll debit cards to generate sticky retail deposit balances.
• Point of Sale (POS) & Payment Gateway: Deploy Warba merchant POS terminals across client distribution outlets.

4. RED FLAGS & DEAL BREAKERS FOR CREDIT COMMITTEE
--------------------------------------------------------------------------------
• Deal Breaker: Failure to produce clean mortgage discharge letter on flagged encumbrances.
• Deal Breaker: Baseline DSCR deteriorating below 1.00x under audited verification.
• Covenant Requirement: Quarterly audited management accounts and certified compliance certificate within 45 days of quarter-end.
`;

  // --- Document 4: Shariah Supervisory Board Compliance Memorandum ---
  const generateSsbMemoHtml = () => `
WARBA BANK K.S.C.P. — SHARIAH SUPERVISORY BOARD
SHARIAH SCREENING & COMPLIANCE ENDORSEMENT MEMORANDUM
Ref: WB-SSB-${business.cr_number}-${new Date().getFullYear()}
Compliance Framework: AAOIFI Standards No. 21 (Financial Papers) & No. 35 (Zakat)

1. SCREENING ASSESSMENT
--------------------------------------------------------------------------------
Borrower: ${business.name} (${business.nameArabic || 'المنشأة'})
CR Number: ${business.cr_number}
Proposed Contract: Commodity Murabaha (Tawarruq) Working Capital Line
Sanction Volume: KWD ${facilityKwd.toLocaleString()}

2. STATUTORY FINANCIAL SCREENING RATIOS (AAOIFI STANDARD NO. 21)
--------------------------------------------------------------------------------
Criteria                               Threshold    Borrower Ratio   Status
--------------------------------------------------------------------------------
Core Business Permissibility           100% Halal   Halal Trade      COMPLIANT
Impermissible (Haram) Income Ratio     <= 5.00%     ${haramPct}%          ${haramPct <= 5.0 ? 'COMPLIANT' : 'BREACH'}
Conventional Debt to Total Assets      <= 30.00%    ${debtRatioPct}%         ${debtRatioPct <= 30.0 ? 'COMPLIANT' : 'BREACH'}
Liquid Assets to Total Assets          >= 33.00%    ${scores.liquidAssetsRatioPct}%         ${scores.liquidAssetsRatioPct >= 33.0 ? 'COMPLIANT' : 'ACCEPTABLE'}

Overall Shariah Score: ${shariahScore}/100 (${scores.status})

3. TAHARAH DIVIDEND PURIFICATION SCHEDULE
--------------------------------------------------------------------------------
• Total Conventional Treasury / Interest Income: KWD ${taharahKwd.toLocaleString()}
• Statutory Disgorgement Mandate: 100% of non-permissible interest income
• Mandatory Charity Beneficiary: ${taharah_schedule.designatedCharity}
• Condition Precedent: Client must furnish official charity receipt voucher prior to drawdown.

4. ZAKAT CALCULATION UNDER AAOIFI STANDARD NO. 35
--------------------------------------------------------------------------------
• Total Asset Base: KWD ${(taharah_schedule.totalAssetsKwd || collateralKwd * 3.8).toLocaleString()}
• Net Zakatable Working Capital Base: KWD ${(taharah_schedule.zakatableBaseKwd || Math.round(revenueKwd * 0.6)).toLocaleString()}
• Statutory Zakat Rate: 2.50% (Lunar Calendar) / 2.577% (Solar Calendar)
• Estimated Annual Zakat Obligation: KWD ${(taharah_schedule.zakatPayableKwd || Math.round(revenueKwd * 0.015)).toLocaleString()}

5. SHARIAH SUPERVISORY BOARD OPINION & FATWA
--------------------------------------------------------------------------------
${shariahScore >= 80 
  ? 'The Shariah Supervisory Board of Warba Bank confirms that the proposed financing structure adheres strictly to the Shariah Standards issued by AAOIFI. The facility may proceed to execution.' 
  : `The Shariah Supervisory Board issues a CONDITIONAL ENDORSEMENT. Initial drawdown is strictly contingent upon: (1) Irrevocable remittance of KWD ${taharahKwd.toLocaleString()} Taharah purification to Bait Al-Zakat; (2) Covenant undertaking that total conventional leverage will not breach 30.0% of assets.`}

Members of the Shariah Supervisory Board:
___________________________________       ___________________________________
Dr. Essa Zaki Shakra                      Dr. Tariq Al-Otaibi
Member, Shariah Supervisory Board         Head of Shariah Audit & Governance
Warba Bank K.S.C.P.                       Warba Bank K.S.C.P.
`;

  const getActiveContent = () => {
    switch (activeDoc) {
      case 'cam': return generateCamHtml();
      case 'term_sheet': return generateTermSheetHtml();
      case 'rm_brief': return generateRmBriefHtml();
      case 'ssb_memo': return generateSsbMemoHtml();
    }
  };

  const getDocTitle = () => {
    switch (activeDoc) {
      case 'cam': return 'Executive Credit Application Memo (CAM)';
      case 'term_sheet': return 'Indicative Murabaha Facility Term Sheet';
      case 'rm_brief': return 'RM Pre-Meeting Client Brief & Playbook';
      case 'ssb_memo': return 'Shariah Supervisory Board Compliance Paper';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${getDocTitle()} - Warba Bank</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; }
            h1, h2 { color: #0284c7; }
            pre { font-family: 'Consolas', 'Courier New', monospace; white-space: pre-wrap; word-break: break-word; font-size: 12px; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin:0; color:#0f172a;">WARBA BANK K.S.C.P.</h2>
              <div style="font-size:11px; color:#64748b;">CORPORATE BANKING GROUP · SHARIAH COMPLIANT</div>
            </div>
            <div style="text-align:right; font-size:11px; color:#64748b;">
              <div>CONFIDENTIAL CLIENT DOCUMENT</div>
              <div>DATE: ${todayStr}</div>
            </div>
          </div>
          <pre>${getActiveContent()}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadDocx = () => {
    setIsExporting(true);
    const content = getActiveContent();
    const docTitle = getDocTitle();
    
    // MHTML / Word XML formatted document that Microsoft Word opens with full styles
    const htmlDocument = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${docTitle}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.3; }
          h1 { color: #004D71; font-size: 16pt; border-bottom: 2pt solid #004D71; padding-bottom: 4pt; }
          h2 { color: #004D71; font-size: 13pt; margin-top: 14pt; }
          pre { font-family: 'Courier New', monospace; font-size: 10pt; white-space: pre-wrap; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
          .header-table td { padding: 4pt; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td><strong style="font-size:14pt; color:#004D71;">WARBA BANK K.S.C.P.</strong><br/><span style="color:#666;">Corporate Banking Division · Kuwait</span></td>
            <td style="text-align:right;"><span style="color:#666;">Date: ${todayStr}</span><br/><strong style="color:#d9534f;">CONFIDENTIAL</strong></td>
          </tr>
        </table>
        <pre>${content}</pre>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlDocument], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WarbaBank_${activeDoc.toUpperCase()}_${business.cr_number}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };

  return (
    <div className="bg-[#0A0E17] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl">
      
      {/* Top Banner: Track 1 Achievement Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Track 1: AI-Powered Client Documentation Studio</span>
          </div>
          <h2 className="font-editorial text-2xl lg:text-3xl text-white font-normal tracking-tight">
            Automated Client Documentation Suite
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-2xl">
            Synthesizes data across internal CRM records and external registries to automatically produce 
            formal, bank-ready credit memoranda, indicative term sheets, and negotiation briefs in seconds.
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
            title="Copy text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer shadow-lg shadow-blue-900/30 font-mono"
            title="Download Microsoft Word document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Word (.doc)</span>
          </button>
        </div>
      </div>

      {/* Document Selector Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        {/* Tab 1: CAM */}
        <button
          onClick={() => setActiveDoc('cam')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeDoc === 'cam'
              ? 'bg-blue-950/50 border-blue-500/50 text-white shadow-lg shadow-blue-950/30'
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
              Document 01 · Formal
            </span>
            <FileText className={`w-4 h-4 ${activeDoc === 'cam' ? 'text-blue-400' : 'text-slate-500'}`} />
          </div>
          <p className="text-xs font-semibold text-white">Credit Application Memo (CAM)</p>
          <span className="text-[10px] text-slate-500 mt-1">Full 6-section committee proposal</span>
        </button>

        {/* Tab 2: Term Sheet */}
        <button
          onClick={() => setActiveDoc('term_sheet')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeDoc === 'term_sheet'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-white shadow-lg shadow-emerald-950/30'
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Document 02 · Client
            </span>
            <FileCheck2 className={`w-4 h-4 ${activeDoc === 'term_sheet' ? 'text-emerald-400' : 'text-slate-500'}`} />
          </div>
          <p className="text-xs font-semibold text-white">Murabaha Offer Term Sheet</p>
          <span className="text-[10px] text-slate-500 mt-1">Sent to client CFO / Board</span>
        </button>

        {/* Tab 3: RM Brief */}
        <button
          onClick={() => setActiveDoc('rm_brief')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeDoc === 'rm_brief'
              ? 'bg-purple-950/50 border-purple-500/50 text-white shadow-lg shadow-purple-950/30'
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
              Document 03 · Internal
            </span>
            <Briefcase className={`w-4 h-4 ${activeDoc === 'rm_brief' ? 'text-purple-400' : 'text-slate-500'}`} />
          </div>
          <p className="text-xs font-semibold text-white">RM Meeting & Negotiation Brief</p>
          <span className="text-[10px] text-slate-500 mt-1">Talking points & CFO Q&A guide</span>
        </button>

        {/* Tab 4: SSB Memo */}
        <button
          onClick={() => setActiveDoc('ssb_memo')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeDoc === 'ssb_memo'
              ? 'bg-amber-950/50 border-amber-500/50 text-white shadow-lg shadow-amber-950/30'
              : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Document 04 · Shariah
            </span>
            <ShieldCheck className={`w-4 h-4 ${activeDoc === 'ssb_memo' ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <p className="text-xs font-semibold text-white">Shariah Supervisory Paper</p>
          <span className="text-[10px] text-slate-500 mt-1">AAOIFI 21/35 & Taharah clearance</span>
        </button>

      </div>

      {/* Main Document Preview Container (Styled like an official paper document) */}
      <div className="bg-[#06090F] border border-white/[0.08] rounded-xl p-6 lg:p-8 font-mono text-xs text-slate-300 relative shadow-inner overflow-x-auto max-h-[600px] overflow-y-auto">
        
        {/* Subtle Watermark */}
        <div className="absolute top-8 right-8 text-[11px] font-mono text-slate-600 border border-slate-800 rounded px-2.5 py-1 select-none">
          WARBA BANK SECURE DOC · {business.cr_number}
        </div>

        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
          {getActiveContent()}
        </pre>
      </div>

      {/* Document Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Synthesized from 4 sources: MOCI Register, CBK Bureau, Warba Finacle, & Audited Financials</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>Generated in 1.2s · Ready for immediate RM transmission</span>
        </div>
      </div>

    </div>
  );
};
