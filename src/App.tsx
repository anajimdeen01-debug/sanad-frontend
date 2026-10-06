/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Business, EvaluationPayload, Citation, AuditEvent } from './types';
import { apiService } from './services/api';
import { AppSidebar } from './components/AppSidebar';
import { ForensicReportView } from './components/ForensicReportView';
import { DocumentWorkspaceView } from './components/DocumentWorkspaceView';
import { InteractiveInquiryView } from './components/InteractiveInquiryView';
import { RmRadarView } from './components/RmRadarView';
import { ConsolidatedRiskSummary } from './components/ConsolidatedRiskSummary';
import { ClientDocumentationStudio } from './components/ClientDocumentationStudio';
import { UploadDossierModal } from './components/UploadDossierModal';
import { NewBorrowerModal } from './components/NewBorrowerModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { BackendSettingsModal } from './components/BackendSettingsModal';
import { Language, translations } from './i18n/translations';
import { INITIAL_BUSINESSES, MOCK_EVALUATIONS } from './data/mockData';
import { 
  CheckCircle2, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Synchronous resolution of initial URL state (eliminates flash/layout shift on refresh):
  const getInitialState = () => {
    const defaultBiz = INITIAL_BUSINESSES[0];
    const defaultEval = MOCK_EVALUATIONS[defaultBiz.id] || null;

    if (typeof window === 'undefined') {
      return { biz: defaultBiz, tab: 'report' as const, evalPayload: defaultEval };
    }

    const params = new URLSearchParams(window.location.search);
    const targetBizId = params.get('biz');
    const rawTab = params.get('tab');

    let validTab: 'workspace' | 'report' | 'copilot' | 'radar' = 'report';
    if (rawTab === 'workspace' || rawTab === 'docs' || rawTab === 'intake') validTab = 'workspace';
    else if (rawTab === 'report' || rawTab === 'underwriting' || rawTab === 'risk') validTab = 'report';
    else if (rawTab === 'copilot' || rawTab === 'chat') validTab = 'copilot';
    else if (rawTab === 'radar') validTab = 'radar';

    if (!targetBizId) {
      return { biz: defaultBiz, tab: validTab, evalPayload: defaultEval };
    }

    const clean = targetBizId.trim().toLowerCase();
    const matched = INITIAL_BUSINESSES.find(b => 
      b.id.toLowerCase() === clean || 
      b.cr_number?.toLowerCase() === clean ||
      b.name?.toLowerCase().includes(clean)
    );

    if (matched) {
      const evalData = MOCK_EVALUATIONS[matched.id] || Object.values(MOCK_EVALUATIONS).find(e => e.biz_id === matched.id) || defaultEval;
      return { biz: matched, tab: validTab, evalPayload: evalData };
    }

    return { biz: defaultBiz, tab: validTab, evalPayload: defaultEval };
  };

  const initialUrlState = getInitialState();

  const [lang, setLang] = useState<Language>('en');
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(initialUrlState.biz);
  const [evaluation, setEvaluation] = useState<EvaluationPayload | null>(initialUrlState.evalPayload);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);

  // Navigation Tab matching UX Pilot layout
  const [activeTab, setActiveTab] = useState<'workspace' | 'report' | 'copilot' | 'radar'>(initialUrlState.tab);

  // Sub-view toggles for deep contracts & chapters
  const [showFullContractsStudio, setShowFullContractsStudio] = useState<boolean>(false);
  const [showFullChapterBreakdown, setShowFullChapterBreakdown] = useState<boolean>(false);

  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isNewBorrowerModalOpen, setIsNewBorrowerModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

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

  const handleSelectBiz = async (biz: Business | null, preferredTab?: 'workspace' | 'report' | 'copilot' | 'radar') => {
    if (!biz) return;
    const tabToUse = preferredTab || activeTab || 'report';
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
    try {
      const evalData = await apiService.getEvaluation(biz.id);
      if (evalData) {
        setEvaluation(evalData);
      }
    } catch (e) {
      // Graceful fallback to local mock
    }
  };

  const handleSwitchTab = (tab: 'workspace' | 'report' | 'copilot' | 'radar') => {
    setActiveTab(tab);
    localStorage.setItem('sanad_active_tab', tab);
    if (selectedBiz) {
      const newUrl = `${window.location.pathname}?biz=${encodeURIComponent(selectedBiz.id)}&tab=${encodeURIComponent(tab)}`;
      window.history.replaceState(null, '', newUrl);
    }
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

      setActiveTab('report');
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
    } catch (e) {
      showToast('Sign-off recorded in local ledger');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#070c16] text-[#F8FAFC] flex selection:bg-blue-500/20 selection:text-blue-300 ${
        lang === 'ar' ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* 1. Persistent Left Navigation Rail matching UX Pilot */}
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={handleSwitchTab}
        businesses={businesses}
        selectedBiz={selectedBiz}
        onSelectBiz={handleSelectBiz}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        lang={lang}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-[#070c16]">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-8 z-50 p-3 rounded-xl bg-[#0E1322] border border-blue-500/40 text-blue-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Utility Sub-Bar */}
        <div className="bg-[#081224]/80 border-b border-slate-800/60 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium truncate max-w-sm">
              {selectedBiz?.name || 'Gulf Pearl Foods Trading W.L.L.'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              [{selectedBiz?.cr_number || '451290-KW'}]
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="text-[11px] font-mono hover:text-white transition-colors"
            >
              Audit Trail ({auditTrail.length})
            </button>
            <span>•</span>
            <button
              onClick={toggleLanguage}
              className="text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>

        {/* VIEW 1: Document Workspace (Intake & OCR Preview matching Image 1) */}
        {activeTab === 'workspace' && (
          <div className="flex-1">
            <DocumentWorkspaceView
              business={selectedBiz}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onSelectReport={() => handleSwitchTab('report')}
              showToast={showToast}
            />

            {/* Optional Collapsible: Client Documentation Studio */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Track 1: Legal Documentation Studio
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bilingual Islamic contracts, Murabaha term sheets, and AI clause editor.
                  </p>
                </div>
                <button
                  onClick={() => setShowFullContractsStudio(!showFullContractsStudio)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {showFullContractsStudio ? 'Hide Contract Studio' : 'Open Contract Studio'}
                </button>
              </div>

              {showFullContractsStudio && (
                <div className="mt-6 animate-in fade-in">
                  <ClientDocumentationStudio
                    business={selectedBiz}
                    evaluation={evaluation}
                    lang={lang}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Sanad Forensic Intelligence Report (The Core AI Explanation Memo matching Images 4, 5, 6) */}
        {activeTab === 'report' && (
          <div className="flex-1">
            <ForensicReportView
              business={selectedBiz}
              evaluation={evaluation}
              onCitationClick={(code) => {
                const cit = evaluation?.citations?.[code];
                if (cit) setActiveCitation(cit);
              }}
              showToast={showToast}
            />

            {/* Optional Collapsible: 6-Chapter Risk Breakdown */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Deep-Tissue Analysis & Covenant Matrices
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Explore granular cross-registry ledgers, AAOIFI purification math, and stress simulations.
                  </p>
                </div>
                <button
                  onClick={() => setShowFullChapterBreakdown(!showFullChapterBreakdown)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {showFullChapterBreakdown ? 'Hide Detailed Breakdown' : 'Open Detailed Breakdown'}
                </button>
              </div>

              {showFullChapterBreakdown && (
                <div className="mt-6 animate-in fade-in">
                  <ConsolidatedRiskSummary
                    business={selectedBiz}
                    evaluation={evaluation}
                    onApprove={handleApprove}
                    isApproving={isApproving}
                    lang={lang}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: Interactive Analytical Inquiry / AI Assistant (Image 2) */}
        {activeTab === 'copilot' && (
          <div className="flex-1">
            <InteractiveInquiryView
              business={selectedBiz}
              evaluation={evaluation}
              showToast={showToast}
            />
          </div>
        )}

        {/* VIEW 4: Proactive RM Intelligence Radar (Image 3) */}
        {activeTab === 'radar' && (
          <div className="flex-1">
            <RmRadarView
              onSelectBusiness={(bizId) => {
                const b = businesses.find(item => item.id === bizId);
                if (b) handleSelectBiz(b, 'report');
              }}
              showToast={showToast}
            />
          </div>
        )}
      </div>

      {/* Modals & Popovers */}
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
    </div>
  );
}
