import EnergyYield from "@/app/components/EnergyYield";
import FinancialAnalysis from "@/app/components/FinancialAnalysis";
import PermitsAndClearances from "@/app/components/PermitsAndClearances";
import PowerMarketOverview from "@/app/components/PowerMarketOverview";
import ProjectOverview from "@/app/components/ProjectOverview";
import { ProjectLayout } from "@/app/components/ProjectPageLayout";
import ProjectParticipants from "@/app/components/ProjectParticipants";
import ProjectSchedule from "@/app/components/ProjectSchedule";
import RiskAssessment from "@/app/components/RiskAssessment";
import SolarBanner from "@/app/components/SolarBanner";
import TechnicalSpecs from "@/app/components/TechnicalSpecs";

// Define proper TypeScript interfaces based on your data structure
interface ExecutiveSummary {
  title: string;
  location: string;
  capacity: string;
  technology: string;
  keyHighlights: string[];
  summary: string;
}

interface Participant {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: 'verified' | 'pending';
  experience?: string;
  projectsCompleted?: number;
  rating?: number;
}

interface TechnicalSpec {
  parameter: string;
  value: string | number;
  unit: string;
  description: string;
}

interface TechnicalSpecsData {
  modules: TechnicalSpec[];
  inverters: TechnicalSpec[];
  transformers: TechnicalSpec[];
  system: TechnicalSpec[];
}

interface EnergyYieldData {
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

interface Milestone {
  id: string;
  name: string;
  plannedDate: string;
  status: 'completed' | 'in-progress' | 'delayed' | 'upcoming';
  description: string;
  dependencies?: string[];
  progress?: number;
  critical?: boolean;
  duration?: number;
  startDate?: string;
  endDate?: string;
}

interface ScheduleData {
  milestones: Milestone[];
  overallProgress: number;
  criticalPath: string[];
  nextMilestones: Milestone[];
  projectStart: string;
  projectEnd: string;
}

interface RiskItem {
  id: string;
  description: string;
  category: 1 | 2 | 3;
  status: 'open' | 'closed' | 'in-progress';
  mitigation: string;
  probability?: string;
  rating?: number;
  progress?: number;
}

interface Permit {
  id: string;
  description: string;
  authority: string;
  status: 'approved' | 'pending' | 'submitted' | 'not-started';
  submissionDate?: string | null;
  approvalDate?: string | null;
  referenceNumber?: string | null;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface FinancialsData {
  totalCost: number;
  costPerMW: number;
  tariff: number;
  assumptions: Record<string, string | number>;
  debtEquity?: string;
  loanTerm?: string;
}

interface MarketData {
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

interface ProjectData {
  executiveSummary: ExecutiveSummary;
  participants: Record<string, Participant>;
  technicalSpecs: TechnicalSpecsData;
  energyYield: EnergyYieldData;
  schedule: ScheduleData;
  risks: RiskItem[];
  permits: Permit[];
  financials: FinancialsData;
  market: MarketData;
}

// Enhanced data fetching with better error handling and caching
async function getProjectData(): Promise<ProjectData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    // Try multiple possible endpoints
    const endpoints = [
      `${baseUrl}/data/pabna-project.json`,
      `${baseUrl}/api/project-data`,
      '/data/pabna-project.json',
    ];

    let response: Response | null = null;
    
    for (const endpoint of endpoints) {
      try {
        response = await fetch(endpoint, {
          next: { revalidate: isProduction ? 3600 : 60 },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response?.ok) break;
      } catch (e) {
        console.warn(`Failed to fetch from ${endpoint}:`, e);
        continue;
      }
    }

    if (!response || !response.ok) {
      throw new Error('All data fetch attempts failed');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching project data:', error);

    // Return comprehensive mock data for development and fallback
    return {
      executiveSummary: {
        title: "Pabna 100 MW Solar Power Project",
        location: "Pabna District, Bangladesh",
        capacity: "100 MW AC",
        technology: "Monocrystalline PV with Single-Axis Tracking",
        keyHighlights: [
          "100 MW AC installed capacity",
          "Monocrystalline silicon technology with single-axis tracking",
          "Estimated annual generation: 180,000 MWh",
          "PPA secured with Bangladesh Power Development Board",
          "Commercial operation date: Q4 2024"
        ],
        summary: "A 100 MW utility-scale solar power project located in Pabna District, Bangladesh, contributing to the country's renewable energy targets and sustainable development goals."
      },
      participants: {
        projectCompany: {
          name: "Green Energy Bangladesh Ltd.",
          role: "Project Developer and Owner",
          description: "Leading renewable energy developer in Bangladesh with over 200 MW of operational projects.",
          capabilities: ["Project Development", "Financing", "Asset Management"],
          status: "verified",
          experience: "10+ years",
          projectsCompleted: 15,
          rating: 4.5
        },
        epcContractor: {
          name: "SolarTech Engineering",
          role: "Engineering, Procurement & Construction",
          description: "International EPC contractor specializing in utility-scale solar projects.",
          capabilities: ["Engineering Design", "Procurement", "Construction Management"],
          status: "verified",
          experience: "8 years",
          projectsCompleted: 25,
          rating: 4.7
        }
      },
      technicalSpecs: {
        modules: [
          { parameter: "Module Type", value: "Monocrystalline Silicon", unit: "", description: "High-efficiency monocrystalline panels" },
          { parameter: "Peak Power", value: "540", unit: "Wp", description: "Maximum power output per module" },
          { parameter: "Efficiency", value: "21.3", unit: "%", description: "Conversion efficiency under STC" }
        ],
        inverters: [
          { parameter: "Type", value: "Central Inverter", unit: "", description: "Utility-scale central inverter system" },
          { parameter: "Capacity", value: "2500", unit: "kVA", description: "Rated capacity per unit" },
          { parameter: "Efficiency", value: "98.5", unit: "%", description: "Maximum conversion efficiency" }
        ],
        transformers: [
          { parameter: "Type", value: "Pad-mounted Transformer", unit: "", description: "Step-up transformer for grid interconnection" },
          { parameter: "Capacity", value: "33/132", unit: "kV", description: "Primary/secondary voltage ratings or typical configuration" }
        ],
        system: [
          { parameter: "Mounting System", value: "Single-Axis Tracker", unit: "", description: "Automated sun tracking system" },
          { parameter: "System Voltage", value: "1500", unit: "VDC", description: "Maximum system voltage" }
        ]
      },
      energyYield: {
        firstYear: {
          p50: { generation: 180000, cufDC: 23.5, cufAC: 21.8 },
          p75: { generation: 172000, cufDC: 22.4, cufAC: 20.8 },
          p90: { generation: 165000, cufDC: 21.5, cufAC: 20.0 },
          p99: { generation: 158000, cufDC: 20.6, cufAC: 19.1 }
        },
        degradation: {
          firstYear: 2,
          subsequentYears: 0.5
        },
        assumptions: [
          "Solar resource: 4.8 kWh/m²/day average",
          "Performance ratio: 86%",
          "Availability: 98%",
          "Soiling losses: 3%",
          "Temperature losses: 4%"
        ]
      },
      schedule: {
        milestones: [
          {
            id: "1",
            name: "Project Development",
            plannedDate: "2023-Q1",
            status: "completed",
            description: "Initial feasibility studies and project planning",
            duration: 90,
            startDate: "2023-01-15",
            endDate: "2023-04-15"
          },
          {
            id: "2",
            name: "Permit Approvals",
            plannedDate: "2023-Q3",
            status: "completed",
            description: "Environmental and regulatory approvals",
            duration: 120,
            startDate: "2023-04-16",
            endDate: "2023-08-15"
          },
          {
            id: "3",
            name: "Financial Close",
            plannedDate: "2024-Q1",
            status: "in-progress",
            description: "Securing project financing and investment",
            progress: 75,
            duration: 180,
            startDate: "2023-09-01",
            endDate: "2024-02-29",
            critical: true
          }
        ],
        overallProgress: 45,
        criticalPath: ["Financial Close", "Equipment Procurement", "Construction Start"],
        nextMilestones: [
          {
            id: "3",
            name: "Financial Close",
            plannedDate: "2024-Q1",
            status: "in-progress",
            description: "Securing project financing and investment"
          },
          {
            id: "4",
            name: "Equipment Procurement",
            plannedDate: "2024-Q2",
            status: "upcoming",
            description: "Procurement of solar panels and balance of system"
          }
        ],
        projectStart: "2023-Q1",
        projectEnd: "2024-Q4"
      },
      risks: [
        {
          id: "1",
          description: "Delay in financial closure due to market conditions",
          category: 2,
          status: "in-progress",
          mitigation: "Engaging multiple financial institutions and exploring alternative financing structures",
          probability: "medium",
          rating: 3,
          progress: 60
        },
        {
          id: "2",
          description: "Supply chain disruptions for critical components",
          category: 2,
          status: "open",
          mitigation: "Diversifying supplier base and securing advance purchase agreements",
          probability: "medium",
          rating: 2
        }
      ],
      permits: [
        {
          id: "1",
          description: "Environmental Impact Assessment",
          authority: "Department of Environment",
          status: "approved",
          submissionDate: "2023-03-15",
          approvalDate: "2023-06-20",
          referenceNumber: "EIA-2023-0456",
          priority: "high",
          category: "Environmental"
        },
        {
          id: "2",
          description: "Land Use Permit",
          authority: "Ministry of Land",
          status: "pending",
          submissionDate: "2023-05-10",
          priority: "high",
          category: "Land"
        }
      ],
      financials: {
        totalCost: 85000000,
        costPerMW: 0.85,
        tariff: 0.1195,
        assumptions: {
          operationYears: 25,
          degradationRate: 0.5,
          inflationRate: 2.5,
          discountRate: 8,
          debtInterest: 6.5,
          taxRate: 25,
          insuranceCost: 0.5,
          omCost: 1.2
        },
        debtEquity: "70/30",
        loanTerm: "15 years"
      },
      market: {
        totalInstalledCapacity: 25000,
        renewableCapacity: 4500,
        solarCapacity: 1200,
        demandProjection: [
          { year: 2024, peakDemand: 15500 },
          { year: 2025, peakDemand: 16500 },
          { year: 2030, peakDemand: 22000 }
        ],
        energyMix: [
          { source: "Natural Gas", percentage: 62, capacity: 15500 },
          { source: "Coal", percentage: 15, capacity: 3750 },
          { source: "Solar", percentage: 5, capacity: 1200 },
          { source: "Hydro", percentage: 3, capacity: 750 }
        ],
        policyTargets: [
          { year: 2025, renewableTarget: 15, solarTarget: 8 },
          { year: 2030, renewableTarget: 20, solarTarget: 12 }
        ]
      }
    };
  }
}

export default async function PabnaProjectPage() {
  const projectData = await getProjectData();

  return (
    <ProjectLayout>
      {/* Hero Section */}
      <div className="flex justify-center">
          <SolarBanner/>
      </div>
      
      {/* Main Content Sections */}
      <div className="w-auto">
        <ProjectOverview 
          data={projectData.executiveSummary} 
          variant="detailed"
        />
        
        <PowerMarketOverview 
          data={projectData.market} 
          variant="detailed"
        />
        
        <ProjectParticipants 
          data={projectData.participants} 
          variant="detailed"
        />
        
        <TechnicalSpecs 
          data={projectData.technicalSpecs} 
          variant="detailed"
        />
        
        <EnergyYield 
          data={projectData.energyYield} 
          variant="detailed"
        />
        
        <ProjectSchedule 
          data={projectData.schedule} 
          variant="detailed"
        />
        
        <RiskAssessment 
          data={projectData.risks} 
          variant="detailed"
        />
        
        <PermitsAndClearances 
          data={projectData.permits} 
          variant="detailed"
        />
        
        <FinancialAnalysis 
          data={projectData.financials} 
          variant="detailed"
        />
      </div>

      {/* Footer Section */}
      <footer className="m-4 bg-gray-900 text-white p-2">
        <div className="max-w-[100vw] p-2 m-4">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">Pabna Solar Project</h3>
              <p className="text-gray-400 text-sm">
                100 MW utility-scale solar power project contributing to Bangladesh&apos;s 
                renewable energy transition and sustainable development goals.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Location: Pabna District, Bangladesh</p>
                <p>Capacity: 100 MW AC</p>
                <p>Technology: Monocrystalline PV</p>
                <p>COD: Q4 2024</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Paramount Solar Bangladesh Ltd.</p>
                <p>House#22, Road#113/A, Gulshan-2, Dhaka-1212, Dhaka, Bangladesh</p>
                <p>info@gparamountgroupbd.com</p>
                <p>+880 XXXX-XXXXXX</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 m-4 p-2 text-center text-sm text-gray-400">
            <p>&copy; 2025 Paramount Solar Pabna Solar Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </ProjectLayout>
  );
}

// Generate metadata for SEO
export async function generateMetadata() {
  const projectData = await getProjectData();
  
  return {
    title: `${projectData.executiveSummary.title} | Project Overview`,
    description: projectData.executiveSummary.summary,
    keywords: ['solar', 'renewable energy', 'Bangladesh', 'Pabna', '100MW', 'solar project'],
    openGraph: {
      title: projectData.executiveSummary.title,
      description: projectData.executiveSummary.summary,
      type: 'website',
      locale: 'en_US',
    },
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  return [{ project: 'pabna-project' }];
}