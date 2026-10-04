import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface BatchUploadDropzoneProps {
  onUploadFiles: (files: File[]) => Promise<void>;
  isIngesting: boolean;
  ingestStep: string;
  ingestProgress: number;
  lang?: Language;
}

export const BatchUploadDropzone: React.FC<BatchUploadDropzoneProps> = ({
  onUploadFiles,
  isIngesting,
  ingestStep,
  ingestProgress,
  lang = 'en',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleTriggerUpload = async () => {
    if (selectedFiles.length === 0) return;
    await onUploadFiles(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
      
      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-editorial text-base lg:text-lg text-white font-medium">
            {t.batchIngestionTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.batchIngestionSubtitle}
          </p>
        </div>
      </div>

      {/* Main Drag-and-Drop Area - Pure file upload, zero static packets, zero technical chatter */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
          dragActive
            ? 'border-emerald-400 bg-emerald-950/20'
            : 'border-white/10 bg-[#090D16] hover:border-white/20'
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

        <FileText className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm text-slate-200 font-medium">
          {t.dragDropText} <span className="text-emerald-400 underline underline-offset-2">{t.orBrowse}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {t.supportedFormats}
        </p>

        {/* Selected file chips */}
        {selectedFiles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center" onClick={e => e.stopPropagation()}>
            {selectedFiles.map((file, i) => (
              <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-slate-400 hover:text-rose-400 font-bold cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress or Submit Action */}
      {isIngesting ? (
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-emerald-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{ingestStep || t.processingText}</span>
            </span>
            <span>{ingestProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300" 
              style={{ width: `${ingestProgress}%` }} 
            />
          </div>
        </div>
      ) : selectedFiles.length > 0 ? (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-mono text-slate-400">
            {selectedFiles.length} {t.filesReady}
          </span>
          <button
            onClick={handleTriggerUpload}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950"
          >
            <span>{t.uploadButton}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

    </div>
  );
};
