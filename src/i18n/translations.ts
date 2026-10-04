export type Language = 'en' | 'ar';

export interface Translations {
  // Brand & Top Bar
  brandName: string;
  brandArabic: string;
  brandSubtitle: string;
  selectWorkspace: string;
  activeBorrowers: string;
  registerBorrower: string;
  uploadDossier: string;
  downloadMemo: string;
  activeWorkspaceLabel: string;
  verifiedBadge: string;
  copyHash: string;
  copied: string;

  // Dropzone / Ingestion
  batchIngestionTitle: string;
  batchIngestionSubtitle: string;
  dragDropText: string;
  orBrowse: string;
  supportedFormats: string;
  filesReady: string;
  uploadButton: string;
  processingText: string;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  hideBatchIngestion: string;
  showBatchIngestion: string;

  // Primary AI Verdict
  verdictSynthesisTitle: string;
  auditConfidence: string;
  aaoifiCompliant: string;
  unconditionalApproval: string;
  conditionalApproval: string;
  facilitySuspended: string;
  classification: string;
  extractedFromDocs: string;
  ocrVerified: string;
  extractedEntity: string;
  crNumber: string;
  extractedSector: string;
  facilityEnvelope: string;
  pledgedCollateral: string;
  auditingHouse: string;
  workflow: string;
  analyst: string;
  scu: string;
  committee: string;
  pending: string;
  approved: string;
  signAnalyst: string;
  signScu: string;
  sanctionFacility: string;
  downloadSignedMemo: string;

  // Metric Ribbon
  shariahAdmissibility: string;
  debtServiceCapacity: string;
  leverageLtv: string;
  auditDiscrepancies: string;
  compliantStatus: string;
  passStatus: string;
  noConflicts: string;
  criticalConflictsFound: string;

  // Chapters
  chapter1Title: string;
  chapter2Title: string;
  chapter3Title: string;
  chapter4Title: string;
  chapter5Title: string;

  // Modals & General
  cancel: string;
  close: string;
  ingestDocuments: string;
  extracting: string;
  auditTrailTitle: string;

  // Footer
  bankName: string;
  creditCore: string;
  aaoifiStandard: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'Sanad',
    brandArabic: 'سند',
    brandSubtitle: 'Warba Private Credit',
    selectWorkspace: 'Select Active Workspace',
    activeBorrowers: 'Active Borrowers',
    registerBorrower: '+ New Borrower',
    uploadDossier: 'Upload Dossier',
    downloadMemo: 'Export Memo',
    activeWorkspaceLabel: 'Active Underwriting Workspace',
    verifiedBadge: 'Verified',
    copyHash: 'Copy Hash',
    copied: 'Copied!',

    batchIngestionTitle: 'Multi-File Batch Ingestion',
    batchIngestionSubtitle: 'Company details and financials are autonomously extracted from uploaded documents.',
    dragDropText: 'Drag & drop borrower documents here, or',
    orBrowse: 'browse files',
    supportedFormats: 'Supports PDF, DOCX, TXT, and Excel financial filings',
    filesReady: 'files ready for underwriting',
    uploadButton: 'Upload & Run Autonomous Pipeline',
    processingText: 'Extracting and analyzing...',
    emptyStateTitle: 'Sanad Private Credit & Shariah Underwriting',
    emptyStateSubtitle: 'Upload corporate financial statements, commercial registry certificates, or bank ledgers to begin underwriting.',
    hideBatchIngestion: 'Hide Batch Ingestion',
    showBatchIngestion: '+ Batch Ingest Files',

    verdictSynthesisTitle: 'Autonomous AI Underwriter Decision & Synthesis',
    auditConfidence: 'Audit Confidence: 99.4%',
    aaoifiCompliant: 'AAOIFI Compliant',
    unconditionalApproval: 'UNCONDITIONAL SANCTION RECOMMENDED · PRIME ASSET GRADE',
    conditionalApproval: 'CONDITIONAL SANCTION · TAHARAH PURIFICATION REQUIRED',
    facilitySuspended: 'FACILITY SANCTION SUSPENDED · CRITICAL FORENSIC CONFLICT',
    classification: 'Classification',
    extractedFromDocs: 'Autonomously Extracted from Ingested Documents',
    ocrVerified: '100% OCR & NLP Verified',
    extractedEntity: 'Extracted Entity',
    crNumber: 'Commercial Reg (CR)',
    extractedSector: 'Extracted Sector',
    facilityEnvelope: 'Facility Envelope',
    pledgedCollateral: 'Pledged Collateral',
    auditingHouse: 'Auditing House',
    workflow: 'Governance Workflow',
    analyst: 'Analyst',
    scu: 'SCU Shariah',
    committee: 'Committee',
    pending: 'Pending',
    approved: 'Approved',
    signAnalyst: 'Sign as Analyst',
    signScu: 'Sign as SCU Officer',
    sanctionFacility: 'Sanction Facility',
    downloadSignedMemo: 'Download Signed Memo',

    shariahAdmissibility: 'Shariah Admissibility',
    debtServiceCapacity: 'Debt Service Capacity',
    leverageLtv: 'Leverage & Collateral',
    auditDiscrepancies: 'Forensic Audit',
    compliantStatus: 'AAOIFI Compliant',
    passStatus: 'Covenant Pass',
    noConflicts: '0 Critical Conflicts',
    criticalConflictsFound: 'Critical Discrepancy Detected',

    chapter1Title: 'Chapter I: Autonomous Shariah & Credit Synthesis',
    chapter2Title: 'Chapter II: Covenant Resilience & Stress Simulation',
    chapter3Title: 'Chapter III: Forensic Cross-Document Findings',
    chapter4Title: 'Chapter IV: Islamic Structuring & Taharah Mandate',
    chapter5Title: 'Chapter V: Credit Committee Inquiry & Governance',

    cancel: 'Cancel',
    close: 'Close',
    ingestDocuments: 'Ingest Documents',
    extracting: 'Extracting Entity...',
    auditTrailTitle: 'Cryptographic Audit Trail',

    bankName: 'Warba Bank',
    creditCore: 'Sanad AI Private Credit Core',
    aaoifiStandard: 'AAOIFI Standard',
  },
  ar: {
    brandName: 'سند',
    brandArabic: 'Sanad',
    brandSubtitle: 'ائتمان وربة للشركات',
    selectWorkspace: 'اختر ملف المنشأة النشط',
    activeBorrowers: 'المنشآت النشطة',
    registerBorrower: '+ منشأة جديدة',
    uploadDossier: 'رفع المستندات',
    downloadMemo: 'تصدير المذكرة',
    activeWorkspaceLabel: 'ملف الائتمان النشط',
    verifiedBadge: 'موثق رقمياً',
    copyHash: 'نسخ البصمة',
    copied: 'تم النسخ!',

    batchIngestionTitle: 'رفع ملفات الائتمان المجمعة',
    batchIngestionSubtitle: 'يتم استخراج بيانات المنشأة ومؤشراتها المالية تلقائياً من المستندات المرفوعة.',
    dragDropText: 'اسحب وأفلت مستندات المنشأة هنا، أو',
    orBrowse: 'تصفح الملفات',
    supportedFormats: 'يدعم ملفات PDF و DOCX و TXT و Excel المحاسبية',
    filesReady: 'ملفات جاهزة للتدقيق',
    uploadButton: 'رفع وبدء التدقيق الائتماني الآلي',
    processingText: 'جاري استخراج البيانات والتدقيق...',
    emptyStateTitle: 'سند — التدقيق الائتماني والشرعي للشركات',
    emptyStateSubtitle: 'قم برفع القوائم المالية المدققة، مستخرجات السجل التجاري، أو الكشوف البنكية لبدء التدقيق.',
    hideBatchIngestion: 'إخفاء مساحة الرفع',
    showBatchIngestion: '+ رفع ملفات مجمعة',

    verdictSynthesisTitle: 'قرار التدقيق والتحليل الائتماني الآلي',
    auditConfidence: 'دقة المطابقة والتدقيق: 99.4%',
    aaoifiCompliant: 'مطابق لمعايير أيوفي',
    unconditionalApproval: 'توصية بالموافقة الائتمانية غير المشروطة · تصنيف استثماري ممتاز',
    conditionalApproval: 'موافقة ائتمانية مشروطة · يتطلب تطهير الدخل العرضي',
    facilitySuspended: 'تعليق منح التسهيل الائتماني · تعارض مستندي جوهري',
    classification: 'التصنيف الائتماني',
    extractedFromDocs: 'مستخرج آلياً من المستندات المرفوعة',
    ocrVerified: 'موثق بالكامل عبر المعالجة الرقمية',
    extractedEntity: 'اسم المنشأة',
    crNumber: 'السجل التجاري (CR)',
    extractedSector: 'القطاع الاقتصادي',
    facilityEnvelope: 'سقف التمويل المطلوب',
    pledgedCollateral: 'الضمانات المرهونة',
    auditingHouse: 'مكتب التدقيق المحاسبي',
    workflow: 'مسار الاعتماد والرقابة',
    analyst: 'المحلل الائتماني',
    scu: 'الرقابة الشرعية',
    committee: 'لجنة الائتمان',
    pending: 'قيد الاعتماد',
    approved: 'معتمد',
    signAnalyst: 'اعتماد المحلل الائتماني',
    signScu: 'اعتماد الرقابة الشرعية',
    sanctionFacility: 'اعتماد لجنة الائتمان',
    downloadSignedMemo: 'تحميل المذكرة المعتمدة',

    shariahAdmissibility: 'المطابقة والقبول الشرعي',
    debtServiceCapacity: 'كفاية خدمة الدين (DSCR)',
    leverageLtv: 'نسبة التمويل إلى الضمان (LTV)',
    auditDiscrepancies: 'الفحص والتعارض المستندي',
    compliantStatus: 'مطابق لمعايير أيوفي',
    passStatus: 'اجتياز معايير التحمل',
    noConflicts: '0 تعارضات جوهرية',
    criticalConflictsFound: 'تم اكتشاف تعارض مستندي حرج',

    chapter1Title: 'الباب الأول: التحليل الائتماني والشرعي الآلي',
    chapter2Title: 'الباب الثاني: اختبارات الضغط والتحمل المالي',
    chapter3Title: 'الباب الثالث: الفحص المستندي والتحري المقارن',
    chapter4Title: 'الباب الرابع: الهيكلة الإسلامية ومصارف التطهير والزكاة',
    chapter5Title: 'الباب الخامس: الاستفسار الائتماني واعتماد اللجان',

    cancel: 'إلغاء',
    close: 'إغلاق',
    ingestDocuments: 'إدخال المستندات',
    extracting: 'جاري استخراج بيانات المنشأة...',
    auditTrailTitle: 'سجل التوثيق والتدقيق المشفر',

    bankName: 'بنك وربة',
    creditCore: 'محرك سند الائتماني الآلي',
    aaoifiStandard: 'معايير أيوفي الشرعية',
  },
};
