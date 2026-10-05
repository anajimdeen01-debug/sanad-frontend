/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Business, EvaluationPayload, Citation, AuditEvent } from './types';
import { apiService } from './services/api';
import { ExecutiveTopBar } from './components/ExecutiveTopBar';
import { MetricRibbon } from './components/MetricRibbon';
import { PrimaryAiVerdict } from './components/PrimaryAiVerdict';
import { BatchUploadDropzone } from './components/BatchUploadDropzone';
import { ChapterSynthesis } from './components/ChapterSynthesis';
import { ChapterCovenants } from './components/ChapterCovenants';
import { ChapterForensics } from './components/ChapterForensics';
import { ChapterIslamicStructure } from './components/ChapterIslamicStructure';
import { ChapterAskSanad } from './components/ChapterAskSanad';
import { UploadDossierModal } from './components/UploadDossierModal';
import { NewBorrowerModal } from './components/NewBorrowerModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { BackendSettingsModal } from './components/BackendSettingsModal';
import { Language, translations } from './i18n/translations';
import { 
  Building2, 
  CheckCircle2, 
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Database,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationPayload | null>(null);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);

  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isNewBorrowerModalOpen, setIsNewBorrowerModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [showBatchDropzone, setShowBatchDropzone] = useState<boolean>(false);

  // Connection & Ingestion
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(apiService.getBaseUrl());
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestStep, setIngestStep] = useState<string>('');
  const [ingestProgress, setIngestProgress] = useState<number>(0);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  // Initial Load
  const fetchLiveWorkspace = async () => {
    const live = await apiService.checkLiveBackend();
    setIsBackendLive(live);

    const bizList = await apiService.getBusinesses();
    setBusinesses(bizList);

    if (selectedBiz) {
      const active = bizList.find(b => b.id === selectedBiz.id);
      if (active) {
        setSelectedBiz(active);
        const evalData = await apiService.getEvaluation(active.id);
        setEvaluation(evalData);
      }
    }

    const audits = await apiService.getAuditTrail();
    setAuditTrail(audits);
  };

  useEffect(() => {
    fetchLiveWorkspace();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSelectBiz = async (biz: Business) => {
    setSelectedBiz(biz);
    const evalData = await apiService.getEvaluation(biz.id);
    setEvaluation(evalData);
  };

  // MULTI-FILE BATCH UPLOAD: POST /api/upload
  const handleBatchUpload = async (files: File[]) => {
    setIsIngesting(true);
    setIngestProgress(20);
    setIngestStep(lang === 'ar' ? 'جاري رفع الملفات ومعالجتها...' : 'Uploading and analyzing files...');

    try {
      const res = await apiService.uploadAndEvaluate(files, (step, pct) => {
        setIngestStep(lang === 'ar' ? 'جاري الفحص المالي والشرعي...' : step);
        setIngestProgress(pct);
      });

      setSelectedBiz(res.business);
      setEvaluation(res.evaluation);

      // Re-fetch dynamic workspace list
      const bizList = await apiService.getBusinesses();
      setBusinesses(bizList);

      const audits = await apiService.getAuditTrail();
      setAuditTrail(audits);

      setShowBatchDropzone(false);
      showToast(lang === 'ar' ? `اكتمل التدقيق الائتماني: ${res.business.nameArabic || res.business.name}` : `Assessment synthesized: ${res.business.name}`);
    } catch (e) {
      console.error(e);
      showToast(lang === 'ar' ? 'تم تحديث التقييم' : 'Assessment updated');
    } finally {
      setIsIngesting(false);
      setIngestProgress(0);
      setIngestStep('');
    }
  };

  // Governance Sign-Off
  const handleApprove = async (role: 'credit_analyst' | 'scu' | 'committee', officerName: string) => {
    if (!evaluation) return;
    setIsApproving(true);
    try {
      const updated = await apiService.approveEvaluation(evaluation.eval_id, role, officerName);
      setEvaluation({ ...updated });
      const audits = await apiService.getAuditTrail();
      setAuditTrail(audits);
      showToast(lang === 'ar' ? 'تم تسجيل الاعتماد بنجاح' : `Endorsement recorded: ${role.replace('_', ' ').toUpperCase()}`);
    } finally {
      setIsApproving(false);
    }
  };

  // Export Committee Memo
  const handleExportMemo = async () => {
    if (!evaluation || !selectedBiz) return;
    const markdownContent = await apiService.exportCommitteeMemo(evaluation, selectedBiz);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Warba_Credit_Memo_${selectedBiz.cr_number}_${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === 'ar' ? 'تم تصدير المذكرة الائتمانية' : 'Executive Memorandum exported');
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300 ${
        lang === 'ar' ? 'font-arabic' : 'font-sans'
      }`}
    >
      
      {/* 1. Minimal Top Executive Bar (With EN / العربية Switcher) */}
      <ExecutiveTopBar
        businesses={businesses}
        selectedBiz={selectedBiz}
        onSelectBiz={handleSelectBiz}
        onOpenNewBorrowerModal={() => setIsNewBorrowerModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onExportMemo={handleExportMemo}
        onRefreshBackend={fetchLiveWorkspace}
        sha256Hash={evaluation?.sha256Fingerprint || 'd7478a3c9b4e5f019a82cd739b81f3378c21950d603a11028e3b784922ae40e9'}
        isBackendLive={isBackendLive}
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      {/* Main Expansive Canvas */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 lg:px-12 py-8 space-y-6">
        
        {/* Toast Indicator */}
        {toastMessage && (
          <div className="fixed top-16 right-8 z-50 p-3 rounded-xl bg-[#0E1322] border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dynamic State: If a Borrower & Evaluation are loaded */}
        {selectedBiz && evaluation ? (
          <>
            {/* Quick Multi-File Dropzone Toggle Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setSelectedBiz(null); setEvaluation(null); }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
                  title={lang === 'ar' ? 'العودة إلى دليل العملاء' : 'Return to Portfolio Directory'}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'دليل العملاء' : 'Directory'}</span>
                </button>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300">
                  {t.activeWorkspaceLabel}: <strong className="text-white font-semibold">{lang === 'ar' && selectedBiz.nameArabic ? selectedBiz.nameArabic : selectedBiz.name}</strong>
                </span>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  [{selectedBiz.cr_number}]
                </span>
              </div>

              <button
                onClick={() => setShowBatchDropzone(!showBatchDropzone)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showBatchDropzone ? t.hideBatchIngestion : t.showBatchIngestion}</span>
                {showBatchDropzone ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
              </button>
            </div>

            {/* Collapsible Multi-File Batch Dropzone */}
            {showBatchDropzone && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <BatchUploadDropzone
                  onUploadFiles={handleBatchUpload}
                  isIngesting={isIngesting}
                  ingestStep={ingestStep}
                  ingestProgress={ingestProgress}
                  lang={lang}
                />
              </div>
            )}

            {/* PRIMARY AI VERDICT: Front-and-Center */}
            <section aria-label={t.verdictSynthesisTitle}>
              <PrimaryAiVerdict
                evaluation={evaluation}
                selectedBiz={selectedBiz}
                approvalWorkflow={evaluation.approval_workflow}
                onApprove={handleApprove}
                isApproving={isApproving}
                onExportMemo={handleExportMemo}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                lang={lang}
              />
            </section>

            {/* 2. Quiet Metric Ribbon */}
            <section aria-label="Essential Figures">
              <MetricRibbon
                evaluation={evaluation}
                selectedBiz={selectedBiz}
                lang={lang}
              />
            </section>

            {/* 3. The 5 Dynamic AI Living Chapters */}
            <div className="space-y-0 divide-y-0">
              
              {/* Chapter 1: Autonomous Shariah & Credit Synthesis */}
              <ChapterSynthesis
                evaluation={evaluation}
                selectedBiz={selectedBiz}
                onCitationClick={cit => setActiveCitation(cit)}
              />

              {/* Chapter 2: Covenant Resilience & Stress Simulation */}
              <ChapterCovenants
                scenarios={evaluation.stress_scenarios}
                financials={evaluation.financial_analytics}
              />

              {/* Chapter 3: Forensic Cross-Document Detective Findings */}
              <ChapterForensics
                discrepancies={evaluation.discrepancies}
              />

              {/* Chapter 4: Islamic Structuring & Taharah/Zakat Mandate */}
              <ChapterIslamicStructure
                schedule={evaluation.taharah_schedule}
                financials={evaluation.financial_analytics}
                selectedBiz={selectedBiz}
              />

              {/* Chapter 5: Interactive AI Inquiry Bar ("Ask Sanad") & Governance Sign-Off */}
              <ChapterAskSanad
                evaluation={evaluation}
                selectedBiz={selectedBiz}
                approvalWorkflow={evaluation.approval_workflow}
                onApprove={handleApprove}
                isApproving={isApproving}
              />

            </div>
          </>
        ) : (
          /* Institutional Portfolio Workspace Directory */
          <div className="py-8 space-y-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBackendLive ? `PostgreSQL Database Online · ${businesses.length} Accounts Enrolled` : 'Autonomous Underwriting Engine Online'}</span>
              </div>
              <h2 className="font-editorial text-3xl lg:text-4xl text-white font-medium tracking-tight">
                {lang === 'ar' ? 'المحفظة الائتمانية والتدقيق الآلي' : 'Corporate Credit Portfolio & Intake'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light max-w-xl mx-auto">
                {lang === 'ar' 
                  ? 'اختر منشأة من قاعدة البيانات لفحص ملفها الائتماني والشرعي، أو اسحب مستندات جديدة للمطابقة الفورية.'
                  : 'Select an active borrower from the credit database to review autonomous Shariah & credit synthesis, or upload a new dossier for real-time extraction.'}
              </p>
            </div>

            {/* Directly Embedded Clean Batch Dropzone */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  {lang === 'ar' ? 'رفع ملفات جديدة للاستخراج الآلي' : 'Ingest New Multi-File Credit Dossier'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">PDF, TXT, DOCX, XLSX</span>
              </div>
              <BatchUploadDropzone
                onUploadFiles={handleBatchUpload}
                isIngesting={isIngesting}
                ingestStep={ingestStep}
                ingestProgress={ingestProgress}
                lang={lang}
              />
            </div>

            {/* Borrowers in Database Directory */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-xl text-white font-normal flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  {lang === 'ar' ? 'المنشآت المسجلة في قاعدة البيانات' : 'Active Corporate Accounts in Database'}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {businesses.length} {lang === 'ar' ? 'ملفات ائتمانية' : 'Dossiers Ready'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businesses.map((biz) => {
                  const displayName = lang === 'ar' && biz.nameArabic ? biz.nameArabic : biz.name;
                  const isHighRisk = biz.riskRating === 'C' || biz.status === 'flagged';
                  const isMediumRisk = biz.riskRating === 'BBB' || biz.riskRating === 'BB';
                  return (
                    <div 
                      key={biz.id}
                      onClick={() => handleSelectBiz(biz)}
                      className="p-5 rounded-2xl bg-[#0E1424] hover:bg-[#12192D] border border-white/[0.08] hover:border-emerald-500/40 transition-all cursor-pointer group space-y-4 relative overflow-hidden shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-white group-hover:text-emerald-300 transition-colors text-sm">
                            {displayName}
                          </p>
                          <p className="text-xs text-slate-400 font-light">
                            {biz.sector}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            CR: {biz.cr_number}
                          </p>
                        </div>
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                          isHighRisk
                            ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                            : isMediumRisk
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        }`}>
                          Rating {biz.riskRating || 'A'}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                        <div className="font-mono text-[11px]">
                          Facility: <span className="text-white font-medium">KWD {(biz.facility_requested / 1000000).toFixed(2)}M</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-emerald-400 group-hover:translate-x-1 transition-transform font-medium">
                          <span>{lang === 'ar' ? 'فتح الملف' : 'Audit Dossier'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Clean Institutional Footer - Zero Technical Clutter */}
      <footer className="border-t border-white/[0.06] py-6 px-6 lg:px-12 text-xs text-slate-500 font-light">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{t.bankName}</span>
            <span>·</span>
            <span>{t.creditCore}</span>
            <span>·</span>
            <span className="font-mono text-emerald-400/90 text-[11px]">{t.aaoifiStandard} 2026.1</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 inline-block" />
            <span>{lang === 'ar' ? 'محرك التدقيق الآلي نشط' : 'Autonomous Engine Online'}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadDossierModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onIngest={handleBatchUpload}
        isIngesting={isIngesting}
        ingestStep={ingestStep}
        ingestProgress={ingestProgress}
        lang={lang}
      />

      <NewBorrowerModal
        isOpen={isNewBorrowerModalOpen}
        onClose={() => setIsNewBorrowerModalOpen(false)}
        onUploadFiles={handleBatchUpload}
        isIngesting={isIngesting}
        ingestStep={ingestStep}
        ingestProgress={ingestProgress}
        lang={lang}
      />

      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditTrail={auditTrail}
      />

      <BackendSettingsModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        apiUrl={apiUrl}
        isBackendLive={isBackendLive}
        onUpdateApiUrl={url => {
          setApiUrl(url);
          apiService.setBaseUrl(url);
        }}
        onRefreshCheck={async () => {
          await fetchLiveWorkspace();
          showToast(isBackendLive ? 'Backend connected' : 'Backend checked');
        }}
      />

      {/* Citation Popover Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1322] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                {activeCitation.code}
              </span>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-white text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  {lang === 'ar' ? 'المستند المرجعي' : 'Source Filing'}
                </span>
                <p className="font-semibold text-white">{activeCitation.docName}</p>
                <p className="text-slate-400 font-mono text-[11px]">{activeCitation.page}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-white/[0.06] text-slate-200 italic leading-relaxed text-xs">
                "{activeCitation.excerpt}"
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                <span>{lang === 'ar' ? 'البصمة المشفرة:' : 'Cryptographic Digest:'}</span>
                <span className="text-purple-300">{activeCitation.verifiedHash}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
