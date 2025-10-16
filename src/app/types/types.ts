// types/project.ts
export interface ProjectParticipant {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: 'verified' | 'pending';
  experience?: string;
  projectsCompleted?: number;
  rating?: number;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  additionalInfo?: string;
}

export interface TechnicalSpec {
  parameter: string;
  value: string | number;
  unit?: string;
  description?: string;
}

export interface EnergyYieldData {
  firstYear: {
    p50: { generation: number; cufDC: number; cufAC: number };
    p75: { generation: number; cufDC: number; cufAC: number };
    p90: { generation: number; cufDC: number; cufAC: number };
    p99: { generation: number; cufDC: number; cufAC: number };
  };
  degradation: {
    firstYear: number;
    subsequentYears: number;
  };
  assumptions: string[];
}

export interface RiskItem {
  id: string;
  category: 1 | 2 | 3;
  description: string;
  status: 'open' | 'closed' | 'in-progress';
  mitigation?: string;
  probability?: string;
  rating?: number;
  progress?: number;
}

export interface Permit {
  id: string;
  description: string;
  authority: string;
  status: 'approved' | 'pending' | 'submitted' | 'not-started';
  submissionDate?: string | null;
  approvalDate?: string | null;
  referenceNumber?: string | null;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  estimatedTimeline?: string;
  documents?: string[];
}

export interface FinancialAssumptions {
  operationYears?: number;
  degradationRate?: number;
  inflationRate?: number;
  discountRate?: number;
  debtInterest?: number;
  taxRate?: number;
  insuranceCost?: number;
  omCost?: number;
  [key: string]: string | number | undefined;
}

export interface FinancialsData {
  totalCost: number;
  costPerMW: number;
  tariff: number;
  assumptions: FinancialAssumptions;
  debtEquity?: string;
  loanTerm?: string;
}

export interface MarketData {
  totalInstalledCapacity: number;
  renewableCapacity: number;
  solarCapacity: number;
  demandProjection: Array<{
    year: number;
    peakDemand: number;
  }>;
  energyMix: Array<{
    source: string;
    percentage: number;
    capacity: number;
  }>;
  policyTargets: Array<{
    year: number;
    renewableTarget: number;
    solarTarget: number;
  }>;
}

export interface Milestone {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: 'completed' | 'in-progress' | 'delayed' | 'upcoming';
  description: string;
  dependencies?: string[];
  progress?: number;
  critical?: boolean;
  duration?: number;
  startDate?: string;
  endDate?: string;
  subTasks?: Milestone[];
}

export interface ScheduleData {
  milestones: Milestone[];
  overallProgress: number;
  criticalPath: string[];
  nextMilestones: Milestone[];
  projectStart: string;
  projectEnd: string;
}

export interface ExecutiveSummary {
  title: string;
  location: string;
  capacity: string;
  technology: string;
  keyHighlights: string[];
  summary: string;
}

export interface ProjectData {
  executiveSummary: ExecutiveSummary;
  participants: Record<string, ProjectParticipant>;
  technicalSpecs: {
    modules: TechnicalSpec[];
    inverters: TechnicalSpec[];
    transformers: TechnicalSpec[];
    system: TechnicalSpec[];
  };
  energyYield: EnergyYieldData;
  schedule: ScheduleData;
  risks: RiskItem[];
  permits: Permit[];
  financials: FinancialsData;
  market: MarketData;
}