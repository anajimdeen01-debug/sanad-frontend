import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, X, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface NewBorrowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadFiles: (files: File[]) => Promise<void>;
  isIngesting?: boolean;
  ingestStep?: string;
  ingestProgress?: number;
  lang?: Language;
}

export const NewBorrowerModal: React.FC<NewBorrowerModalProps> = ({
  isOpen,
  onClose,
  onUploadFiles,
  isIngesting = false,
  ingestStep = '',
  ingestProgress = 0,
  lang = 'en',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  if (!isOpen) return null;

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
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      setFiles(prev => [...prev, ...Array.from(selected)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    await onUploadFiles(files);
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0E1322] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg text-white font-medium">
                {t.registerBorrower.replace('+', '').trim()}
              </h3>
              <p className="text-xs text-slate-400">
                {t.batchIngestionSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pure File Dropzone - No manual inputs, No static mock packets */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
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
            <FileText className="w-9 h-9 text-slate-400 mb-2" />
            <p className="text-sm text-slate-200 font-medium">
              {t.dragDropText} <span className="text-emerald-400 underline underline-offset-2">{t.orBrowse}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t.supportedFormats}
            </p>

            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center" onClick={e => e.stopPropagation()}>
                {files.map((file, i) => (
                  <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {isIngesting && (
            <div className="space-y-2 p-3 rounded-xl bg-[#090D16] border border-emerald-500/30 animate-pulse">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{ingestStep || t.processingText}</span>
                </span>
                <span>{ingestProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${ingestProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={files.length === 0 || isIngesting}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                files.length > 0 && !isIngesting
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isIngesting ? t.extracting : `${t.ingestDocuments} (${files.length})`}</span>
              {files.length > 0 && !isIngesting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
