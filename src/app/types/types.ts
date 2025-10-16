// types/project.ts
export interface ProjectParticipant {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
}

export interface TechnicalSpec {
  parameter: string;
  value: string | number;
  unit?: string;
}

export interface EnergyYield {
  year: number;
  generation: number;
  cufDC: number;
  cufAC: number;
  poe: 'P50' | 'P75' | 'P90' | 'P99';
}

export interface RiskItem {
  id: string;
  category: 1 | 2 | 3;
  description: string;
  status: 'open' | 'closed' | 'in-progress';
  mitigation: string;
}

export interface ProjectData {
  executiveSummary: {
    capacity: string;
    location: string;
    technology: string;
    keyHighlights: string[];
  };
  participants?: ProjectParticipant[];
  technicalSpecs?: {
    modules: TechnicalSpec[];
    inverters: TechnicalSpec[];
    transformers: TechnicalSpec[];
  };
  energyYield: EnergyYield[];
  risks: RiskItem[];
  financials?: {
    totalCost: number;
    costPerMW: number;
    tariff: number;
    assumptions: Record<string, any>;
  };
}