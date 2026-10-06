/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UploadCloud, 
  Search, 
  Plus, 
  FileText, 
  Image as ImageIcon, 
  CreditCard, 
  CheckCircle2, 
  Filter, 
  MoreVertical, 
  Maximize2, 
  Check, 
  AlertCircle, 
  FolderOpen
} from 'lucide-react';
import { Business } from '../types';

interface DocumentWorkspaceViewProps {
  business: Business | null;
  onOpenUploadModal: () => void;
  onSelectReport: () => void;
  showToast?: (msg: string) => void;
}

export const DocumentWorkspaceView: React.FC<DocumentWorkspaceViewProps> = ({
  business,
  onOpenUploadModal,
  onSelectReport,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  const documents = [
    {
      id: 'doc_1',
      name: 'Loan_Agreement_v3.pdf',
      size: '2.4 MB',
      timeAgo: '12 mins ago',
      type: 'Loan Agreement',
      typeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      confidence: 98.2,
      status: 'Verified',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      idRef: 'WRB-99812-CN',
      entities: {
        borrower: business?.name || 'Gulf Pearl Foods Trading W.L.L.',
        principal: 'KWD 1,250,000.00',
        profitRate: '4.25% P.A.',
        maturity: '14 May 2029',
        fieldsCount: 24,
      },
    },
    {
      id: 'doc_2',
      name: 'Audited_Financials_FY23.pdf',
      size: '4.8 MB',
      timeAgo: '28 mins ago',
      type: 'Financial Audit',
      typeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      confidence: 99.4,
      status: 'Verified',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      idRef: 'AUD-2023-KW',
      entities: {
        borrower: business?.name || 'Gulf Pearl Foods Trading W.L.L.',
        principal: 'EBITDA KWD 1,554,800',
        profitRate: 'Margin 18.4%',
        maturity: 'FY2023 End',
        fieldsCount: 52,
      },
    },
    {
      id: 'doc_3',
      name: 'Invoice_44912.png',
      size: '840 KB',
      timeAgo: '45 mins ago',
      type: 'Invoice',
      typeColor: 'bg-slate-700/50 text-slate-300 border-slate-600',
      confidence: 95.0,
      status: 'Verified',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      idRef: 'INV-44912',
      entities: {
        borrower: business?.name || 'Gulf Pearl Foods Trading W.L.L.',
        principal: 'KWD 84,200.00',
        profitRate: 'Supplier LC',
        maturity: '30 Days Net',
        fieldsCount: 16,
      },
    },
    {
      id: 'doc_4',
      name: 'Passport_KYC_scan.jpg',
      size: '1.2 MB',
      timeAgo: '1 hour ago',
      type: 'KYC / ID',
      typeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      confidence: 88.4,
      status: 'Processed',
      statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      idRef: 'KYC-PACI-88',
      entities: {
        borrower: 'Managing Partner (Kuwait Civil ID)',
        principal: 'Civil ID #284091800192',
        profitRate: 'Kuwaiti National',
        maturity: 'Exp: 2028',
        fieldsCount: 12,
      },
    },
  ];

  const activeDoc = documents[selectedDocIndex] || documents[0];

  return (
    <div className="min-h-screen bg-[#070c16] text-slate-200 font-sans p-6 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Document Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Process, extract, and verify data from your banking documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#0d1728] border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-56 sm:w-64 transition-all"
            />
          </div>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Upload</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Area & Right Extraction Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* LEFT COLUMN: Dropzone & Recent Analyses Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Drag & Drop Card */}
          <div
            onClick={onOpenUploadModal}
            className="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl bg-[#091120]/70 hover:bg-[#0c162a]/90 transition-all cursor-pointer p-8 sm:p-12 text-center group relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 text-blue-400" />
            </div>

            <h3 className="text-base font-semibold text-white tracking-tight mb-1">
              Drag & drop document to analyze
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Support for Loan Agreements, Audited Financials, KYC Forms, and Invoices. AI-powered OCR with 99% accuracy.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                Browse Files
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#0f1d33] hover:bg-[#142642] text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-all"
              >
                Select from Folder
              </button>
            </div>
          </div>

          {/* Recent Analyses Card */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white tracking-tight">Recent Analyses</h2>
              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    <th className="pb-3 font-semibold">Document Name</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Confidence</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {documents.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocIndex(idx)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedDocIndex === idx ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-white truncate">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {doc.size} • {doc.timeAgo}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${doc.typeColor}`}>
                          {doc.type}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="space-y-1 w-24">
                          <span className="font-mono font-bold text-white text-[11px]">
                            {doc.confidence}%
                          </span>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${doc.confidence}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${doc.statusColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Extraction Insights & Visual Preview */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl sticky top-20">
            {/* Active Document Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white truncate max-w-[170px]">
                    {activeDoc.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {activeDoc.idRef}</p>
                </div>
              </div>
              <button 
                onClick={onSelectReport}
                title="View Full Forensic Intelligence Report"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* AI Extraction Insights Card */}
            <div className="pt-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  AI EXTRACTION INSIGHTS
                </span>
                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  AI ENHANCED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#08101d] border border-slate-800 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">OCR CONFIDENCE</p>
                  <p className="text-lg font-bold text-white font-mono mt-0.5">
                    {activeDoc.confidence} <span className="text-xs font-normal text-slate-400">%</span>
                  </p>
                </div>
                <div className="bg-[#08101d] border border-slate-800 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 font-mono uppercase">DATA POINTS</p>
                  <p className="text-lg font-bold text-white font-mono mt-0.5">
                    {activeDoc.entities.fieldsCount} <span className="text-xs font-normal text-slate-400">FIELDS</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="mb-4">
              <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-2">
                VISUAL PREVIEW
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[9px] text-slate-400 leading-tight select-none opacity-80 h-28 overflow-hidden relative">
                <div className="space-y-1">
                  <p className="text-slate-300 font-bold">STATE OF KUWAIT • MINISTRY OF COMMERCE & INDUSTRY</p>
                  <p>COMMERCIAL REGISTRATION EXTRACT: #451290-KW</p>
                  <p>BORROWER: GULF PEARL FOODS TRADING W.L.L.</p>
                  <p>CAPITAL: KWD 1,250,000 | SHUWAIKH INDUSTRIAL 2</p>
                  <p>ENCUMBRANCES: PRIMARY LIEN VERIFIED AT SHUWAIKH INDUSTRIAL</p>
                  <p className="text-emerald-400">OCR PARSER: MERKLE PERFECTED • BLOCK #148948</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Extracted Entities */}
            <div className="space-y-3 pt-1 border-t border-slate-800/80">
              <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                EXTRACTED ENTITIES
              </p>

              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">BORROWER NAME</p>
                <p className="text-xs font-semibold text-white mt-0.5">{activeDoc.entities.borrower}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">PRINCIPAL / FACILITY</p>
                <p className="text-xs font-semibold text-white mt-0.5 font-mono">{activeDoc.entities.principal}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">MARGIN / RATE</p>
                  <p className="text-xs font-semibold text-white mt-0.5 font-mono">{activeDoc.entities.profitRate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">MATURITY</p>
                  <p className="text-xs font-semibold text-white mt-0.5 font-mono">{activeDoc.entities.maturity}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (showToast) showToast('Dossier discrepancy flagged for audit review.');
                }}
                className="py-2.5 px-3 bg-[#0d1728] hover:bg-[#122036] text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors text-center"
              >
                Flag Issues
              </button>
              <button
                onClick={() => {
                  if (showToast) showToast('Data entities confirmed & synced with credit engine.');
                  onSelectReport();
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors text-center shadow-md shadow-emerald-600/20"
              >
                Validate Data
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
