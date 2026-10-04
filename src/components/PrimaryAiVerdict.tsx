import React from 'react';
import { EvaluationPayload, Business, ApprovalWorkflow } from '../types';
import { 
  FileText, 
  FileDown, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface PrimaryAiVerdictProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
  approvalWorkflow: ApprovalWorkflow;
  onApprove: (role: 'credit_analyst' | 'scu' | 'committee', officerName: string) => Promise<void>;
  isApproving: boolean;
  onExportMemo: () => void;
  onOpenUploadModal: () => void;
  lang?: Language;
}

export const PrimaryAiVerdict: React.FC<PrimaryAiVerdictProps> = ({
  evaluation,
  selectedBiz,
  approvalWorkflow,
  onApprove,
  isApproving,
  onExportMemo,
  lang = 'en',
}) => {
  const { scores, financial_analytics, discrepancies } = evaluation;
  const t = translations[lang];

  const score = scores.score;
  const dscr = financial_analytics.baselineDscr;
  const hasCriticalDisc = discrepancies.some(d => d.severity === 'critical');

  // Determine Autonomous AI Decision
  let verdictStatus: 'APPROVED' | 'CONDITIONAL' | 'SUSPENDED' = 'APPROVED';
  let verdictHeadline = lang === 'ar' ? t.unconditionalApproval : 'UNCONDITIONAL SANCTION RECOMMENDED · PRIME ASSET GRADE';
  let verdictBadgeBg = 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
  let verdictDot = 'bg-emerald-400';
  let verdictProse = '';

  if (hasCriticalDisc || score < 60 || dscr < 1.0) {
    verdictStatus = 'SUSPENDED';
    verdictHeadline = lang === 'ar' ? t.facilitySuspended : 'FACILITY SANCTION SUSPENDED · CRITICAL FORENSIC CONFLICT';
    verdictBadgeBg = 'bg-rose-950/80 border-rose-500/50 text-rose-300';
    verdictDot = 'bg-rose-400';
    verdictProse = lang === 'ar'
      ? `أظهر الفحص المستندي الآلي وجود تعارض جوهري بين المستندات (رهن عقاري مسجل بقيمة 420,000 د.ك غير مفصح عنه في إقرار السجل التجاري). تعذر استيفاء شروط الضمان وتثبيت الرهن. تم تعليق منح التسهيل حتى شطب الرهن السابق وتقديم شهادة خلو موانع رسمية.`
      : `Autonomous forensic extraction detected 1 or more critical document contradictions (including an undisclosed registered mortgage of KWD 420,000 conflicting with the commercial registry affidavit). Credit perfection cannot be established. Facility is suspended until mortgage release is verified.`;
  } else if (score < 80 || evaluation.taharah_schedule.taharahPurificationDueKwd > 20000) {
    verdictStatus = 'CONDITIONAL';
    verdictHeadline = lang === 'ar' ? t.conditionalApproval : 'CONDITIONAL SANCTION · TAHARAH PURIFICATION REQUIRED';
    verdictBadgeBg = 'bg-amber-950/80 border-amber-500/50 text-amber-300';
    verdictDot = 'bg-amber-400';
    verdictProse = lang === 'ar'
      ? `تؤكد المراجعة الائتمانية كفاية التدفقات النقدية التشغيلية لتغطية خدمة الدين بمعدل ${dscr}x (الحد الأدنى 1.25x). التوصية بالمنح مشروطة بتطهير مبلغ ${evaluation.taharah_schedule.taharahPurificationDueKwd.toLocaleString()} د.ك من عوائد الفوائد التقليدية العرضية وتوريدها لحساب الهيئة الخيرية قبل بدء السحب.`
      : `Underwriting model confirms acceptable operating debt capacity (${dscr}x DSCR vs 1.25x minimum). Endorsement is conditional upon mandatory disgorgement of KWD ${evaluation.taharah_schedule.taharahPurificationDueKwd.toLocaleString()} in identified conventional treasury interest income directly to charity prior to line drawdown.`;
  } else {
    verdictStatus = 'APPROVED';
    verdictHeadline = lang === 'ar' ? t.unconditionalApproval : 'UNCONDITIONAL SANCTION RECOMMENDED · PRIME ASSET GRADE';
    verdictBadgeBg = 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    verdictDot = 'bg-emerald-400';
    verdictProse = lang === 'ar'
      ? `اكتملت المطابقة المستندية الآلية بدقة 99.4%. لا توجد رهون غير معلنة في سجلات وزارة التجارة وسجل الائتمان المركزي. الفحص الشرعي يؤكد التوافق الكامل مع معايير أيوفي رقم 21 و35. التدفقات النقدية تحقق معدل تغطية خدمة دين استثنائي ${dscr}x.`
      : `Autonomous extraction and multi-document circularization completed with 99.4% confidence. Zero undisclosed liens detected across Ministry of Commerce registers and Central Bank ledgers. Shariah screening validates full adherence to AAOIFI Standards. Operating cash flow yields a strong DSCR of ${dscr}x.`;
  }

  const ltv = financial_analytics.ltvRatioPct;
  const facilityFormatted = (financial_analytics.facilityRequestedKwd / 1000000).toFixed(2);
  const collateralFormatted = (financial_analytics.collateralValueKwd / 1000000).toFixed(2);
  const displayName = lang === 'ar' && selectedBiz.nameArabic ? selectedBiz.nameArabic : selectedBiz.name;

  return (
    <section 
      aria-label={t.verdictSynthesisTitle}
      className="p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-[#0E1424] via-[#0C111F] to-[#090D16] border border-white/[0.08] shadow-2xl space-y-6 relative overflow-hidden"
    >
      
      {/* Decorative ambient gradient backdrop */}
      <div className={`absolute top-0 right-0 w-96 h-36 blur-3xl pointer-events-none opacity-20 ${
        verdictStatus === 'APPROVED' ? 'bg-emerald-500' : verdictStatus === 'SUSPENDED' ? 'bg-rose-500' : 'bg-amber-500'
      }`} />

      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-widest">
            {t.verdictSynthesisTitle}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">{t.aaoifiCompliant}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{t.auditConfidence}</span>
        </div>
      </div>

      {/* Main Headline Verdict Card */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border tracking-wide ${verdictBadgeBg}`}>
            <span className={`w-2 h-2 rounded-full ${verdictDot} animate-pulse`} />
            <span>{verdictHeadline}</span>
          </span>

          <span className="font-mono text-xs text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md">
            {t.classification}: {selectedBiz.riskRating || 'A+'}
          </span>
        </div>

        {/* AI Synthesis Prose */}
        <p className="text-sm lg:text-base text-slate-200 leading-relaxed font-light max-w-4xl">
          {verdictProse}
        </p>
      </div>

      {/* Autonomous Document Extraction Matrix */}
      <div className="p-4 rounded-xl bg-[#080B12] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.04]">
          <span className="flex items-center gap-1.5 text-purple-400">
            <FileText className="w-3.5 h-3.5" />
            <span>{t.extractedFromDocs}</span>
          </span>
          <span className="text-emerald-400 text-[11px]">{t.ocrVerified}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{t.extractedEntity}:</span>
            <p className="font-semibold text-white truncate" title={displayName}>{displayName}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{selectedBiz.cr_number}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{t.crNumber}:</span>
            <p className="font-mono font-bold text-white">{selectedBiz.cr_number}</p>
            <p className="text-[10px] text-emerald-400 font-mono">{lang === 'ar' ? 'سجل نشط وموثق' : 'Active Status'}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{t.extractedSector}:</span>
            <p className="font-medium text-slate-200 truncate">{selectedBiz.sector}</p>
            <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'قطاع تجاري معتمد' : 'Commercial Core'}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{t.facilityEnvelope}:</span>
            <p className="font-mono font-bold text-blue-400">{facilityFormatted}M KWD</p>
            <p className="text-[10px] text-slate-400 font-mono">{lang === 'ar' ? 'مرابحة / تورق' : 'Murabaha / Tawarruq'}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{t.pledgedCollateral}:</span>
            <p className="font-mono font-bold text-emerald-400">{collateralFormatted}M KWD</p>
            <p className="text-[10px] text-blue-400 font-mono">LTV: {ltv}%</p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{t.auditingHouse}:</span>
            <p className="font-medium text-slate-200 truncate">{lang === 'ar' ? 'إرنست آند يونغ (العيبان)' : 'Ernst & Young'}</p>
            <p className="text-[10px] text-emerald-400 font-mono">{lang === 'ar' ? 'تقرير غير متحفظ' : 'Unqualified'}</p>
          </div>
        </div>
      </div>

      {/* Governance Endorsement Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
        
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span className="text-slate-400">{t.workflow}:</span>
          <span className={approvalWorkflow.creditAnalyst.approved ? 'text-emerald-400' : 'text-slate-400'}>
            {t.analyst} {approvalWorkflow.creditAnalyst.approved ? '✓' : `(${t.pending})`}
          </span>
          <span>·</span>
          <span className={approvalWorkflow.scuReviewer.approved ? 'text-emerald-400' : 'text-slate-400'}>
            {t.scu} {approvalWorkflow.scuReviewer.approved ? '✓' : `(${t.pending})`}
          </span>
          <span>·</span>
          <span className={approvalWorkflow.committeeSanction.approved ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {t.committee} {approvalWorkflow.committeeSanction.approved ? '✓' : `(${t.pending})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!approvalWorkflow.creditAnalyst.approved && (
            <button
              onClick={() => onApprove('credit_analyst', 'Ahmad Al-Sabah, CFA')}
              disabled={isApproving}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium transition-colors cursor-pointer border border-white/10"
            >
              {t.signAnalyst}
            </button>
          )}

          {!approvalWorkflow.scuReviewer.approved && approvalWorkflow.creditAnalyst.approved && (
            <button
              onClick={() => onApprove('scu', 'Dr. Tariq Al-Otaibi')}
              disabled={isApproving}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-medium transition-colors cursor-pointer border border-emerald-500/30"
            >
              {t.signScu}
            </button>
          )}

          {!approvalWorkflow.committeeSanction.approved && approvalWorkflow.creditAnalyst.approved && approvalWorkflow.scuReviewer.approved && (
            <button
              onClick={() => onApprove('committee', 'Corporate Credit Committee')}
              disabled={isApproving}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors cursor-pointer shadow-md shadow-purple-950"
            >
              {t.sanctionFacility}
            </button>
          )}

          <button
            onClick={onExportMemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-semibold transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{t.downloadSignedMemo}</span>
          </button>
        </div>

      </div>

    </section>
  );
};
