export type DiscrepancySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Discrepancy {
  id: string;
  title: string;
  severity: DiscrepancySeverity;
  description: string;
  sourceDocA: {
    name: string;
    excerpt: string;
    pageOrRef: string;
  };
  sourceDocB: {
    name: string;
    excerpt: string;
    pageOrRef: string;
  };
  financialImpactKwd?: number;
  category: 'undisclosed_liability' | 'revenue_mismatch' | 'collateral_conflict' | 'compliance_breach';
}

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  revenueShockPct: number;
  rateHikeBps: number;
  resultingDscr: number;
  status: 'PASS' | 'NEAR_THRESHOLD' | 'BREACH';
  ebitdaKwd?: number;
  ebitdaImpactKwd?: number;
  debtServiceKwd: number;
}

export interface TaharahSchedule {
  totalAssetsKwd: number;
  zakatableBaseProxyPct: number; // e.g. 60%
  zakatableBaseKwd: number;
  zakatRatePct: number; // 2.5% Lunar / 2.577% Solar
  zakatPayableKwd: number;
  prohibitedInterestIncomeKwd: number;
  prohibitedIncomePct: number;
  taharahPurificationDueKwd: number;
  designatedCharity: string;
  aaoifiReference: string;
}

export interface ShariahBreakdown {
  score: number; // 0 - 100
  shariah_score?: number;
  status: 'COMPLIANT' | 'CONDITIONAL' | 'NON_COMPLIANT';
  scoreDelta: string; // e.g. "+15 pts improved from v1"
  haramRevenueRatioPct: number; // threshold < 5%
  debtToAssetsPct: number; // threshold < 30%
  liquidAssetsRatioPct: number; // threshold > 33%
  prohibitedActivitiesFound: number;
  shariahBoardOpinion: string;
}

export interface FinancialAnalytics {
  annualRevenueKwd: number;
  revenueGrowthPct: number;
  netIncomeKwd: number;
  ebitdaKwd: number;
  operatingMarginPct: number;
  ltvRatioPct: number;
  facilityRequestedKwd: number;
  collateralValueKwd: number;
  quarterlyRevenueSparkline: number[]; // e.g. 4 quarters
  annualDebtServiceKwd: number;
  baselineDscr: number;
  covenantMinimumDscr: number; // 1.25x
}

export interface Citation {
  id: string;
  code: string; // e.g. "SRC-001#c0"
  docName: string;
  page: string;
  excerpt: string;
  verifiedHash: string;
}

export interface MemoSection {
  id: number;
  title: string;
  content: string;
  citations: string[];
}

export interface ApprovalWorkflow {
  creditAnalyst: {
    approved: boolean;
    name?: string;
    timestamp?: string;
    notes?: string;
  };
  scuReviewer: {
    approved: boolean;
    name?: string;
    timestamp?: string;
    notes?: string;
  };
  committeeSanction: {
    approved: boolean;
    name?: string;
    timestamp?: string;
    notes?: string;
  };
}

export interface Business {
  id: string;
  name: string;
  nameArabic: string;
  sector: string;
  cr_number: string;
  status: 'active' | 'under_review' | 'flagged' | 'approved';
  facility_requested: number;
  collateral_value: number;
  created_at: string;
  riskRating: 'A+' | 'A' | 'BBB' | 'BB' | 'C';
}

export interface AiVerdict {
  status: 'SANCTION_APPROVED' | 'CONDITIONAL_SANCTION' | 'FACILITY_SUSPENDED';
  title: string;
  rationale: string;
  keyConditions: string[];
  underwritingConfidencePct: number;
  extractedFromDocsCount: number;
}

export interface EvaluationPayload {
  eval_id: string;
  biz_id: string;
  business_id?: string;
  timestamp: string;
  sha256Fingerprint: string;
  merkleRoot: string;
  blockHeight: number;
  scores: ShariahBreakdown;
  financial_analytics: FinancialAnalytics;
  discrepancies: Discrepancy[];
  shariah_flags?: string[];
  stress_scenarios: StressScenario[];
  taharah_schedule: TaharahSchedule;
  memo_sections: MemoSection[];
  citations: Record<string, Citation>;
  approval_workflow: ApprovalWorkflow;
  verdict?: AiVerdict;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  hash: string;
  prevHash: string;
}
