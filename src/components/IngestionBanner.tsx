import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Coins, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface IngestionBannerProps {
  onIngest: (
    files: File[],
    facilityRequested: number,
    collateralValue: number,
    kind: 'financial_audit' | 'internal'
  ) => Promise<void>;
  isIngesting: boolean;
  ingestStep: string;
  ingestProgress: number;
  initialFacility?: number;
  initialCollateral?: number;
  onLoadPreset: (presetKey: 'biz_petro' | 'biz_ahlia' | 'biz_retail') => void;
}

export const IngestionBanner: React.FC<IngestionBannerProps> = ({
  onIngest,
  isIngesting,
  ingestStep,
  ingestProgress,
  initialFacility = 4500000,
  initialCollateral = 8100000,
  onLoadPreset,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [facilityRequested, setFacilityRequested] = useState<number>(initialFacility);
  const [collateralValue, setCollateralValue] = useState<number>(initialCollateral);
  const [kind, setKind] = useState<'financial_audit' | 'internal'>('financial_audit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop changes when borrower changes
  React.useEffect(() => {
    if (initialFacility) setFacilityRequested(initialFacility);
    if (initialCollateral) setCollateralValue(initialCollateral);
  }, [initialFacility, initialCollateral]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const triggerIngest = async () => {
    // If no custom files attached, synthesize standard corporate dossier package
    const filesToSubmit = files.length > 0 ? files : [
      new File(['Sample Financial Audit Statement FY2025 with certified balance sheet.'], 'Audited_Financial_Statement_FY2025.pdf', { type: 'application/pdf' }),
      new File(['Ministry of Commerce and Industry Registry and CBK Ledgers.'], 'MOCI_Commercial_Extract_Official.pdf', { type: 'application/pdf' }),
      new File(['Appraisal report and asset valuation deed for collateral plot.'], 'Independent_Valuation_Report.pdf', { type: 'application/pdf' })
    ];
    await onIngest(filesToSubmit, facilityRequested, collateralValue, kind);
  };

  const steps = [
    { label: 'Extracting', desc: 'Entities & Ratios' },
    { label: 'Stress-Testing', desc: 'Covenant Shocks' },
    { label: 'Discrepancy Scanning', desc: 'Cross-Doc Auditing' },
    { label: 'Shariah Screening', desc: 'AAOIFI & Taharah' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900/90 via-[#0E1726]/90 to-slate-900/90 border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl transition-all relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-28 bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-28 bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Header bar with toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Autonomous Ingestion & Multi-Document Forensic Pipeline</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                Live Ingestion Core
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Ingests Audited Financials, Bank Ledgers, MOCI Registries & Appraisals to trigger simultaneous covenant stress and Shariah screening.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick preset selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Load Demo Dossier:</span>
            <button
              onClick={() => onLoadPreset('biz_petro')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer"
            >
              🟢 PetroServices (Prime)
            </button>
            <button
              onClick={() => onLoadPreset('biz_ahlia')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-[11px] font-medium transition-colors cursor-pointer"
            >
              🔴 Al-Ahlia (Mortgage Flag)
            </button>
            <button
              onClick={() => onLoadPreset('biz_retail')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-950/60 text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 text-[11px] font-medium transition-colors cursor-pointer"
            >
              🟡 Gulf Retail (Taharah)
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Pipeline' : 'Collapse Pipeline'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Collapsible Ingestion Body */}
      {!isCollapsed && (
        <div className="mt-4 space-y-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Drag & Drop Zone (7 cols) */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-7 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] relative ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-950/20'
                  : 'border-white/15 bg-slate-900/50 hover:border-white/30 hover:bg-slate-900/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt,.xlsx,.csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/80 border border-white/10 mb-2 text-emerald-400 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                Drop Financial Audit, Bank Ledger, or MOCI Dossier here, or <span className="text-emerald-400 underline underline-offset-2">Browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Accepts PDF, DOCX, TXT · Automatic multi-pass forensic discrepancy extraction & OCR
              </p>

              {/* Show attached files pills if any */}
              {files.length > 0 && (
                <div 
                  className="flex flex-wrap gap-2 mt-3 w-full justify-center"
                  onClick={e => e.stopPropagation()}
                >
                  {files.map((file, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-emerald-500/40 text-[11px] text-emerald-300 font-mono"
                    >
                      <span>{file.name}</span>
                      <button 
                        onClick={() => removeFile(idx)}
                        className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Inputs: Facility Requested & Collateral Value & Assessment Kind (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Facility Requested (KWD) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Facility Requested (KWD)</span>
                    <span className="text-blue-400 font-mono">Murabaha</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">KWD</span>
                    <input
                      type="number"
                      value={facilityRequested}
                      onChange={e => setFacilityRequested(Number(e.target.value))}
                      disabled={isIngesting}
                      className="w-full bg-slate-950 border border-white/15 focus:border-blue-500 rounded-lg pl-12 pr-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Collateral Value (KWD) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Collateral Value (KWD)</span>
                    <span className="text-emerald-400 font-mono">Appraised</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">KWD</span>
                    <input
                      type="number"
                      value={collateralValue}
                      onChange={e => setCollateralValue(Number(e.target.value))}
                      disabled={isIngesting}
                      className="w-full bg-slate-950 border border-white/15 focus:border-emerald-500 rounded-lg pl-12 pr-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Assessment Kind & LTV preview */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Mode:</span>
                  <div className="flex rounded-lg bg-slate-950 p-0.5 border border-white/10 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setKind('financial_audit')}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        kind === 'financial_audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Audit
                    </button>
                    <button
                      type="button"
                      onClick={() => setKind('internal')}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        kind === 'internal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Internal
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 mr-1.5">LTV Ratio:</span>
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {collateralValue > 0 ? ((facilityRequested / collateralValue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              {/* Launch Ingestion Button */}
              <button
                onClick={triggerIngest}
                disabled={isIngesting}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all shadow-lg cursor-pointer ${
                  isIngesting
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-emerald-950/40'
                }`}
              >
                {isIngesting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Processing Dossier: {ingestStep || 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-emerald-300" />
                    <span>Trigger AI Ingestion & Forensic Pipeline</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Live Progress Stepper during ingestion */}
          {isIngesting && (
            <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{ingestStep}</span>
                </span>
                <span className="font-mono font-bold text-emerald-300">{ingestProgress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${ingestProgress}%` }}
                />
              </div>

              {/* 4 Steps Indicator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {steps.map((s, idx) => {
                  const stepThreshold = (idx + 1) * 25;
                  const isDone = ingestProgress >= stepThreshold;
                  const isCurrent = ingestProgress < stepThreshold && ingestProgress >= stepThreshold - 25;
                  return (
                    <div 
                      key={s.label}
                      className={`text-center p-1.5 rounded-lg border text-[10px] transition-colors ${
                        isDone 
                          ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' 
                          : isCurrent
                          ? 'border-blue-500/40 bg-blue-950/30 text-blue-300 animate-pulse'
                          : 'border-white/5 bg-slate-900/40 text-slate-500'
                      }`}
                    >
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-[9px] opacity-80">{s.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
