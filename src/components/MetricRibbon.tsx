import React from 'react';
import { EvaluationPayload, Business } from '../types';
import { Language, translations } from '../i18n/translations';

interface MetricRibbonProps {
  evaluation: EvaluationPayload;
  selectedBiz: Business;
  lang?: Language;
}

export const MetricRibbon: React.FC<MetricRibbonProps> = ({
  evaluation,
  selectedBiz: _selectedBiz,
  lang = 'en',
}) => {
  const { scores, financial_analytics, discrepancies } = evaluation;
  const t = translations[lang];

  const isShariahCompliant = scores.score >= 80;
  const isDscrPass = financial_analytics.baselineDscr >= financial_analytics.covenantMinimumDscr;
  const criticalCount = discrepancies.filter(d => d.severity === 'critical').length;

  const collateralFormatted = (financial_analytics.collateralValueKwd / 1000000).toFixed(1);

  return (
    <div className="py-6 border-b border-white/[0.06]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
        
        {/* Metric 1: Shariah Admissibility */}
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {t.shariahAdmissibility}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl lg:text-3xl font-bold tracking-tight text-white">
              {scores.score}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </span>
            <span className={`inline-flex items-center text-[11px] font-mono font-medium ${
              isShariahCompliant ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              · {isShariahCompliant ? t.compliantStatus : (lang === 'ar' ? 'يتطلب تطهير' : 'Requires Review')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {scores.prohibitedActivitiesFound === 0 
              ? (lang === 'ar' ? 'خالٍ من الأنشطة المحظورة' : '0 Prohibited Activities') 
              : (lang === 'ar' ? `${scores.prohibitedActivitiesFound} نشاط يتطلب تطهيراً` : `${scores.prohibitedActivitiesFound} Prohibited Risk`)}
          </p>
        </div>

        {/* Metric 2: Debt Service Capacity */}
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {t.debtServiceCapacity}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-2xl lg:text-3xl font-bold tracking-tight ${
              isDscrPass ? 'text-white' : 'text-rose-400'
            }`}>
              {financial_analytics.baselineDscr}x
            </span>
            <span className="text-xs text-slate-400 font-mono">
              DSCR
            </span>
            <span className={`inline-flex items-center text-[11px] font-mono ${
              isDscrPass ? 'text-emerald-400' : 'text-rose-400 font-semibold'
            }`}>
              · {isDscrPass ? t.passStatus : (lang === 'ar' ? 'تعثر في التغطية' : 'Breach')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {lang === 'ar' ? 'الحد الأدنى للسياسة' : 'Policy Floor'}: {financial_analytics.covenantMinimumDscr}x
          </p>
        </div>

        {/* Metric 3: Leverage (LTV) */}
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {t.leverageLtv}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl lg:text-3xl font-bold tracking-tight text-blue-400">
              {financial_analytics.ltvRatioPct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              LTV
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono truncate">
            {lang === 'ar' ? `ضمان مرهون بقيمة ${collateralFormatted} مليون د.ك` : `Backed by ${collateralFormatted}M KWD Collateral`}
          </p>
        </div>

        {/* Metric 4: Audit Discrepancies */}
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {t.auditDiscrepancies}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-2xl lg:text-3xl font-bold tracking-tight ${
              criticalCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {criticalCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ar' ? 'تعارض' : 'Alerts'}
            </span>
          </div>
          <p className={`text-[11px] font-mono truncate ${
            criticalCount > 0 ? 'text-rose-400 font-semibold' : 'text-slate-400'
          }`}>
            {criticalCount === 0 ? t.noConflicts : t.criticalConflictsFound}
          </p>
        </div>

      </div>
    </div>
  );
};
