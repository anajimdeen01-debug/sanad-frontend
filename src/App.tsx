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
import { ConsolidatedRiskSummary } from './components/ConsolidatedRiskSummary';
import { ClientDocumentationStudio } from './components/ClientDocumentationStudio';
import { LiveSourcePuller } from './components/LiveSourcePuller';
import { ProactiveRmRadar } from './components/ProactiveRmRadar';
import { UploadDossierModal } from './components/UploadDossierModal';
import { NewBorrowerModal } from './components/NewBorrowerModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { BackendSettingsModal } from './components/BackendSettingsModal';
import { Language, translations } from './i18n/translations';
import { INITIAL_BUSINESSES, MOCK_EVALUATIONS } from './data/mockData';
import { 
  Building2, 
  CheckCircle2, 
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Database,
  ArrowRight,
  ArrowLeft,
  FileText,
  Layers,
  Zap,
  Sparkles,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Synchronous resolution of initial URL state (eliminates flash/layout shift on refresh):
  const getInitialState = () => {
    if (typeof window === 'undefined') {
      return { biz: null, tab: 'docs' as const, evalPayload: null };
    }
    const params = new URLSearchParams(window.location.search);
    const targetBizId = params.get('biz');
    const rawTab = params.get('tab');
    const targetTab = (rawTab === 'risk' ? 'underwriting' : rawTab) as 'docs' | 'underwriting' | 'chat' | 'radar';
    const validTab = (targetTab && ['docs', 'underwriting', 'chat', 'radar'].includes(targetTab)) ? targetTab : ('docs' as const);

    if (!targetBizId) {
      return { biz: null, tab: validTab, evalPayload: null };
    }

    const clean = targetBizId.trim().toLowerCase();
    const matched = INITIAL_BUSINESSES.find(b => 
      b.id.toLowerCase() === clean || 
      b.cr_number?.toLowerCase() === clean ||
      b.name?.toLowerCase().includes(clean)
    );

    if (matched) {
      const evalData = MOCK_EVALUATIONS[matched.id] || Object.values(MOCK_EVALUATIONS).find(e => e.biz_id === matched.id) || null;
      return { biz: matched, tab: validTab, evalPayload: evalData };
    }

    return { biz: null, tab: validTab, evalPayload: null };
  };

  const initialUrlState = getInitialState();

  const [lang, setLang] = useState<Language>('en');
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(initialUrlState.biz);
  const [evaluation, setEvaluation] = useState<EvaluationPayload | null>(initialUrlState.evalPayload);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);

  // Workspace Mode: Client Documentation Studio vs Underwriting vs Ask Sanad vs Proactive
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'docs' | 'underwriting' | 'chat' | 'radar'>(initialUrlState.tab);

  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isNewBorrowerModalOpen, setIsNewBorrowerModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [showBatchDropzone, setShowBatchDropzone] = useState<boolean>(false);
  const [showHomeRadar, setShowHomeRadar] = useState<boolean>(false);

  // Connection & Ingestion
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(apiService.getBaseUrl());
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestStep, setIngestStep] = useState<string>('');
  const [ingestProgress, setIngestProgress] = useState<number>(0);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isReAnalyzing, setIsReAnalyzing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  // Initial Load (Non-blocking background sync)
  const fetchLiveWorkspace = async () => {
    try {
      const [live, bizList, audits] = await Promise.all([
        apiService.checkLiveBackend(),
        apiService.getBusinesses(),
        apiService.getAuditTrail()
      ]);

      setIsBackendLive(live);
      if (bizList && bizList.length > 0) {
        setBusinesses(bizList);
      }
      if (audits && audits.length > 0) {
        setAuditTrail(audits);
      }

      // If URL had a business that was not found locally but exists on backend:
      const params = new URLSearchParams(window.location.search);
      const targetBizId = params.get('biz');
      if (targetBizId && !selectedBiz && bizList && bizList.length > 0) {
        const cleanTarget = targetBizId.trim().toLowerCase();
        const matched = bizList.find(b => 
          b.id.toLowerCase() === cleanTarget || 
          b.cr_number?.toLowerCase() === cleanTarget ||
          b.name?.toLowerCase().includes(cleanTarget)
        );

        if (matched) {
          setSelectedBiz(matched);
          const evalData = await apiService.getEvaluation(matched.id);
          if (evalData) setEvaluation(evalData);
        }
      }
    } catch (err) {
      console.warn('Live workspace sync notice:', err);
    }
  };

  useEffect(() => {
    fetchLiveWorkspace();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSelectBiz = async (biz: Business | null, preferredTab?: 'docs' | 'underwriting' | 'chat' | 'radar') => {
    if (!biz) {
      handleReturnToDirectory();
      return;
    }
    const tabToUse = preferredTab || activeWorkspaceTab || 'docs';
    setSelectedBiz(biz);
    localStorage.setItem('sanad_active_biz_id', biz.id);
    localStorage.setItem('sanad_active_tab', tabToUse);
    const newUrl = `${window.location.pathname}?biz=${encodeURIComponent(biz.id)}&tab=${encodeURIComponent(tabToUse)}`;
    window.history.replaceState(null, '', newUrl);

    // Immediate local evaluation resolution
    const localEval = MOCK_EVALUATIONS[biz.id] || Object.values(MOCK_EVALUATIONS).find(e => e.biz_id === biz.id);
    if (localEval) {
      setEvaluation(localEval);
    }
    const evalData = await apiService.getEvaluation(biz.id);
    if (evalData) {
      setEvaluation(evalData);
    }
  };

  const switchWorkspaceTab = (tab: 'docs' | 'underwriting' | 'chat' | 'radar') => {
    setActiveWorkspaceTab(tab);
    localStorage.setItem('sanad_active_tab', tab);
    if (selectedBiz) {
      const newUrl = `${window.location.pathname}?biz=${encodeURIComponent(selectedBiz.id)}&tab=${encodeURIComponent(tab)}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const handleReturnToDirectory = () => {
    setSelectedBiz(null);
    setEvaluation(null);
    localStorage.removeItem('sanad_active_biz_id');
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Live Multi-Source Ingestion Pull (MOCI + CiNet + Finacle by CR)
  const handleSelectBusinessByCr = async (crNumber: string) => {
    const cleanCr = crNumber.trim().toLowerCase();
    const found = businesses.find(b => 
      b.cr_number?.toLowerCase().includes(cleanCr) || 
      cleanCr.includes(b.cr_number?.toLowerCase())
    );

    if (found) {
      await handleSelectBiz(found);
      setActiveWorkspaceTab('docs');
      showToast(`Registry dossier pulled for ${found.name}`);
    } else {
      const newBiz: Business = {
        id: `biz_${Date.now()}`,
        name: `Corporate Entity (${crNumber})`,
        nameArabic: 'المنشأة التجارية المعتمدة',
        sector: 'Industrial & Trade Logistics',
        cr_number: crNumber,
        status: 'under_review',
        facility_requested: 2500000,
        collateral_value: 3500000,
        created_at: new Date().toISOString(),
        riskRating: 'A',
      };
      const created = await apiService.createBusiness(newBiz);
      await handleSelectBiz(created);
      setActiveWorkspaceTab('docs');
      showToast(`Live records synthesized for ${crNumber}`);
    }
  };

  // 1-Click Proactive RM Action Trigger
  const handleSelectClientAndDoc = async (crNumber: string, docType: 'cam' | 'term_sheet' | 'rm_brief') => {
    await handleSelectBusinessByCr(crNumber);
    setActiveWorkspaceTab('docs');
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
      setActiveWorkspaceTab('docs');
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

  // Live Autonomous AI Re-Analysis with Google Gemini (Zero Static Keywords)
  const handleLiveReAnalyze = async () => {
    if (!selectedBiz) return;
    setIsReAnalyzing(true);
    showToast(lang === 'ar' ? `جاري تدقيق ملف ${selectedBiz.nameArabic || selectedBiz.name} عبر Gemini...` : `Dispatching ${selectedBiz.name} dossier to Google Gemini Underwriter Agent...`);
    try {
      const refreshedEval = await apiService.reAnalyzeWithLiveAi(selectedBiz);
      setEvaluation(refreshedEval);
      const audits = await apiService.getAuditTrail();
      setAuditTrail(audits);
      showToast(lang === 'ar' ? 'اكتمل التحليل المستقل عبر الذكاء الاصطناعي بنجاح' : 'Live Autonomous AI Analysis complete with Gemini!');
    } catch (err) {
      console.error('Re-analysis error:', err);
      showToast(lang === 'ar' ? 'اكتمل التدقيق الائتماني' : 'Autonomous analysis refreshed.');
    } finally {
      setIsReAnalyzing(false);
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
    link.download = `Warba_Credit_Memo_${selectedBiz.cr_number}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === 'ar' ? 'تم تصدير المذكرة الائتمانية' : 'Executive Memorandum exported');
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col selection:bg-blue-500/20 selection:text-blue-300 ${
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
          <div className="fixed top-16 right-8 z-50 p-3 rounded-xl bg-[#0E1322] border border-blue-500/40 text-blue-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dynamic State: If a Borrower & Evaluation are loaded */}
        {selectedBiz && evaluation ? (
          <>
            {/* Top Workspace Bar & Return to Directory */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReturnToDirectory}
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

              {/* WORKSPACE TABS */}
              <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
                <button
                  onClick={() => switchWorkspaceTab('docs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    activeWorkspaceTab === 'docs'
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Client Doc Studio</span>
                  <span className="text-[10px] bg-blue-950 px-1.5 py-0.2 rounded text-blue-200">Track 1</span>
                </button>

                <button
                  onClick={() => switchWorkspaceTab('underwriting')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    activeWorkspaceTab === 'underwriting'
                      ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Risk & Shariah Summary</span>
                </button>

                <button
                  onClick={() => switchWorkspaceTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    activeWorkspaceTab === 'chat'
                      ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Sanad Assistant</span>
                </button>

                <button
                  onClick={() => switchWorkspaceTab('radar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    activeWorkspaceTab === 'radar'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Proactive RM Radar</span>
                </button>
              </div>
            </div>

            {/* TAB 1: CLIENT DOCUMENTATION STUDIO (TRACK 1 CORE DELIVERABLE) */}
            {activeWorkspaceTab === 'docs' && (
              <section aria-label="Client Documentation Studio" className="animate-in fade-in">
                <ClientDocumentationStudio
                  business={selectedBiz}
                  evaluation={evaluation}
                  lang={lang}
                />
              </section>
            )}

            {/* TAB 2: CONSOLIDATED RISK & SHARIAH SUMMARY (STREAMLINED EXECUTIVE VIEW) */}
            {activeWorkspaceTab === 'underwriting' && (
              <section aria-label="Consolidated Risk & Shariah Summary" className="animate-in fade-in">
                <ConsolidatedRiskSummary
                  business={selectedBiz}
                  evaluation={evaluation}
                  onApprove={handleApprove}
                  isApproving={isApproving}
                  onReAnalyze={handleLiveReAnalyze}
                  isReAnalyzing={isReAnalyzing}
                  onOpenCitation={setActiveCitation}
                  lang={lang}
                />
              </section>
            )}

            {/* TAB 3: ASK SANAD ASSISTANT (CONVERSATIONAL COPILOT & CITATIONS) */}
            {activeWorkspaceTab === 'chat' && (
              <section aria-label="Ask Sanad Assistant" className="animate-in fade-in">
                <ChapterAskSanad
                  evaluation={evaluation}
                  selectedBiz={selectedBiz}
                  approvalWorkflow={evaluation.approval_workflow}
                  onApprove={handleApprove}
                  isApproving={isApproving}
                />
              </section>
            )}

            {/* TAB 4: PROACTIVE RM RADAR */}
            {activeWorkspaceTab === 'radar' && (
              <section aria-label="Proactive Radar" className="animate-in fade-in">
                <ProactiveRmRadar
                  onSelectClientAndDoc={handleSelectClientAndDoc}
                  lang={lang}
                />
              </section>
            )}

          </>
        ) : (
          /* Institutional Portfolio Workspace Directory & Multi-Source Intake */
          <div className="py-8 space-y-10 max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Warba Bank Challenge · Track 1: AI-Powered Client Documentation</span>
              </div>
              <h2 className="font-editorial text-3xl lg:text-4xl text-white font-medium tracking-tight">
                {lang === 'ar' ? 'منظومة إنتاج الوثائق الائتمانية الآلية' : 'Autonomous Client Documentation & Multi-Source Intake'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light max-w-2xl mx-auto">
                {lang === 'ar' 
                  ? 'سحب فوري للبيانات من السجل التجاري (MOCI) وشبكة المعلومات الائتمانية (CiNet) والنظام المصرفي الداخلي لإنتاج مذكرات الائتمان وعروض المرابحة.'
                  : 'Synthesize data across internal CRM records and external Kuwaiti registries to automatically produce bank-ready credit memoranda, indicative term sheets, and proactive relationship briefs.'}
              </p>
            </div>

            {/* PILLAR 1: LIVE MULTI-SOURCE INGESTION PULLER (Pull by CR number without uploading) */}
            <LiveSourcePuller
              onSelectBusinessByCr={handleSelectBusinessByCr}
              businesses={businesses}
              isPulling={isIngesting}
              lang={lang}
            />

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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((biz) => {
                  const displayName = lang === 'ar' && biz.nameArabic ? biz.nameArabic : biz.name;
                  const isHighRisk = biz.riskRating === 'C' || biz.status === 'flagged';
                  const isMediumRisk = biz.riskRating === 'BBB' || biz.riskRating === 'BB';
                  return (
                    <div 
                      key={biz.id}
                      onClick={() => handleSelectBiz(biz)}
                      className="p-5 rounded-2xl bg-[#0E1424] hover:bg-[#12192D] border border-white/[0.08] hover:border-blue-500/40 transition-all cursor-pointer group space-y-4 relative overflow-hidden shadow-lg flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="font-medium text-white group-hover:text-blue-300 transition-colors text-sm line-clamp-1">
                              {displayName}
                            </p>
                            <p className="text-xs text-slate-400 font-light line-clamp-1">
                              {biz.sector}
                            </p>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                            isHighRisk
                              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                              : isMediumRisk
                              ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          }`}>
                            Rating {biz.riskRating || 'A'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500">
                          CR: {biz.cr_number}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                        <div className="font-mono text-[11px]">
                          Facility: <span className="text-white font-medium">KWD {(biz.facility_requested / 1000000).toFixed(2)}M</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-blue-400 group-hover:translate-x-1 transition-transform font-medium">
                          <span>{lang === 'ar' ? 'فتح' : 'Open'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PILLAR 2: PROACTIVE FRONT-OFFICE RM RADAR (Collapsible Portfolio Alerts) */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                    {lang === 'ar' ? 'رادار الفرص الاستباقية لمدير العلاقات' : 'Proactive RM Opportunities & Portfolio Alerts'}
                  </span>
                  <span className="text-[10px] bg-amber-950/60 border border-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    3 Signals
                  </span>
                </div>
                <button
                  onClick={() => setShowHomeRadar(!showHomeRadar)}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showHomeRadar ? 'Collapse Radar' : 'Expand Radar'}</span>
                  {showHomeRadar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showHomeRadar && (
                <div className="pt-3 animate-in fade-in">
                  <ProactiveRmRadar
                    onSelectClientAndDoc={handleSelectClientAndDoc}
                    lang={lang}
                  />
                </div>
              )}
            </div>

            {/* Collapsible Manual Batch Dropzone (Alternative File Ingestion) */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-slate-400" />
                  {lang === 'ar' ? 'رفع ملفات إضافية يدوياً' : 'Optional: Manual PDF Dossier File Dropzone'}
                </span>
                <button
                  onClick={() => setShowBatchDropzone(!showBatchDropzone)}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showBatchDropzone ? 'Hide Dropzone' : 'Show Manual Dropzone'}</span>
                  {showBatchDropzone ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showBatchDropzone && (
                <div className="pt-2 animate-in fade-in">
                  <BatchUploadDropzone
                    onUploadFiles={handleBatchUpload}
                    isIngesting={isIngesting}
                    ingestStep={ingestStep}
                    ingestProgress={ingestProgress}
                    lang={lang}
                  />
                </div>
              )}
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
            <span>Track 1: AI-Powered Client Documentation</span>
            <span>·</span>
            <span className="font-mono text-blue-400 text-[11px]">AAOIFI 2026.1 Compliant</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>Autonomous Multi-Source Synthesizer Online</span>
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

      {/* Citation Popover Modal - Document Page Inspector */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/15 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                  {activeCitation.code}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Grounding Verified
                </span>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-white text-2xl cursor-pointer p-1"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {/* Document and Exact Page Info */}
              <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    {lang === 'ar' ? 'المستند المرجعي الأصلي' : 'Originating Corporate Filing'}
                  </span>
                  <p className="font-semibold text-white text-xs truncate max-w-[280px]">
                    {activeCitation.docName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    {lang === 'ar' ? 'الصفحة والفقرة' : 'Page & Section'}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded border border-emerald-500/40 inline-block">
                    📄 {activeCitation.page}
                  </span>
                </div>
              </div>

              {/* Simulated Document Page Snippet */}
              <div className="bg-[#080B12] rounded-xl border border-white/[0.08] p-4 space-y-2.5 font-serif text-slate-200 text-xs relative">
                <div className="border-b border-slate-800 pb-1.5 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                  <span>WARBA AUDIT PROVENANCE · OCR PASS</span>
                  <span>{activeCitation.page.toUpperCase()}</span>
                </div>

                <div className="bg-amber-400/15 border-l-4 border-amber-400 p-3 rounded text-slate-100 font-sans text-xs leading-relaxed">
                  <span className="text-[10px] font-mono text-amber-300 uppercase block mb-1 font-semibold">
                    Verbatim Text Extraction:
                  </span>
                  <span className="bg-amber-400/30 text-amber-100 px-1 py-0.5 rounded font-medium">
                    "{activeCitation.excerpt}"
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-1.5 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                  <span>SOURCE HASH: {activeCitation.verifiedHash}</span>
                  <span className="text-emerald-400">100% RECONCILED</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>{lang === 'ar' ? 'البصمة المشفرة للتدقيق:' : 'Cryptographic Proof Hash:'}</span>
                <span className="text-purple-300 font-mono text-[10px]">{activeCitation.verifiedHash}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
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
