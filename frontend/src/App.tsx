import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck,
  Filter,
  MapPinned,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BaseLayout } from './components/layout/BaseLayout';
import { PrototypeNotice } from './components/features/PrototypeNotice';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { EmptyState } from './components/ui/EmptyState';
import { StyleGuide } from './components/ui/StyleGuide';
import { useTheme } from './hooks/useTheme';
import { cn } from './utils/cn';

type TabId =
  | 'Executive Summary'
  | 'Regional Map'
  | 'Provider Readiness'
  | 'Vendor Evaluation'
  | 'AI Governance'
  | 'Audit & Provenance';

type ReadinessTier = 'READY' | 'CONDITIONAL' | 'NOT READY';
type VendorStatus = 'Recommended' | 'Conditional' | 'Under Review' | 'Flagged';
type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
type GovernanceStatus = 'Governed' | 'Ungoverned';
type CompletionStatus = 'Complete' | 'Pending';

interface Region {
  id: string;
  name: string;
  counties: number;
  providers: number;
  anchorSystem: string;
  ready: number;
  conditional: number;
  notReady: number;
  position: string;
}

interface Provider {
  name: string;
  npi: string;
  county: string;
  hub: string;
  facilityType: string;
  ehr: string | null;
  oncEdition: string | null;
  hieConnected: boolean | null;
  broadband: string | null;
  itStaff: number | null;
  readinessScore: number | null;
  tier: ReadinessTier;
  confidence: 'High' | 'Medium' | 'Low';
}

interface Vendor {
  name: string;
  category: string;
  score: number | null;
  status: VendorStatus;
  soc2Expiration: string | null;
  riskAlerts: number | null;
  certifications: string[];
  breaches24m: number | null;
  dimensions: {
    label: string;
    score: number;
    weight: string;
  }[];
}

interface AITool {
  name: string;
  users: number | null;
  division: string;
  dataExposure: string | null;
  risk: RiskLevel;
  governance: GovernanceStatus;
  interactions30d: number | null;
  nist: number[];
  action: string;
}

interface Deliverable {
  name: string;
  status: CompletionStatus;
  detail: string;
}

interface DataSourceRecord {
  name: string;
  url: string;
  use: string;
  cadence: string;
}

const tabs: TabId[] = [
  'Executive Summary',
  'Regional Map',
  'Provider Readiness',
  'Vendor Evaluation',
  'AI Governance',
  'Audit & Provenance',
];

const colors = {
  ocean: '#0B3C61',
  sky: '#288DC2',
  earth: '#789B4A',
  ready: '#789B4A',
  conditional: '#D6A23D',
  notReady: '#B54747',
  muted: '#94A3B8',
};

const regions: Region[] = [
  { id: 'west', name: 'Western Hub', counties: 16, providers: 54, anchorSystem: 'Appalachian Regional / Mission Health', ready: 18, conditional: 24, notReady: 12, position: 'left-4 top-16 h-28 w-32' },
  { id: 'northwest', name: 'Northwest Hub', counties: 10, providers: 38, anchorSystem: 'Atrium Wake Forest Baptist', ready: 11, conditional: 18, notReady: 9, position: 'left-40 top-10 h-24 w-28' },
  { id: 'piedmont', name: 'Piedmont Hub', counties: 12, providers: 62, anchorSystem: 'Cone Health / UNC Health', ready: 21, conditional: 27, notReady: 14, position: 'left-36 top-40 h-28 w-36' },
  { id: 'sandhills', name: 'Sandhills Hub', counties: 14, providers: 45, anchorSystem: 'FirstHealth of the Carolinas', ready: 10, conditional: 23, notReady: 12, position: 'left-[11rem] top-72 h-24 w-28' },
  { id: 'southeast', name: 'Southeast Hub', counties: 15, providers: 62, anchorSystem: 'Cape Fear Valley Health', ready: 12, conditional: 31, notReady: 19, position: 'left-64 top-[21rem] h-28 w-36' },
  { id: 'northeast', name: 'Northeast Hub', counties: 18, providers: 41, anchorSystem: 'ECU Health / Vidant', ready: 8, conditional: 19, notReady: 14, position: 'right-6 top-28 h-44 w-32' },
];

const providers: Provider[] = [
  { name: 'Appalachian Regional Healthcare System', npi: '1023456789', county: 'Watauga', hub: 'Western Hub', facilityType: 'Hospital', ehr: 'Epic', oncEdition: '2015 Cures Update', hieConnected: true, broadband: '250/100', itStaff: 12, readinessScore: 87, tier: 'READY', confidence: 'High' },
  { name: 'Kinston Community Health Center', npi: '1145678901', county: 'Lenoir', hub: 'Northeast Hub', facilityType: 'FQHC', ehr: null, oncEdition: null, hieConnected: false, broadband: '<25/3', itStaff: 0, readinessScore: 18, tier: 'NOT READY', confidence: 'Medium' },
  { name: 'Roanoke Chowan Community Health Center', npi: '1256789012', county: 'Bertie', hub: 'Northeast Hub', facilityType: 'FQHC', ehr: 'eClinicalWorks', oncEdition: '2015 Edition', hieConnected: true, broadband: '100/20', itStaff: 2, readinessScore: 63, tier: 'CONDITIONAL', confidence: 'High' },
  { name: 'Pender Memorial Hospital', npi: '1367890123', county: 'Pender', hub: 'Southeast Hub', facilityType: 'CAH', ehr: 'Meditech', oncEdition: '2015 Edition', hieConnected: false, broadband: '50/10', itStaff: 1, readinessScore: 42, tier: 'CONDITIONAL', confidence: 'Medium' },
  { name: 'Robeson Rural Health Partners', npi: '1478901234', county: 'Robeson', hub: 'Southeast Hub', facilityType: 'RHC', ehr: 'Athenahealth', oncEdition: '2015 Cures Update', hieConnected: true, broadband: '100/20', itStaff: 3, readinessScore: 71, tier: 'READY', confidence: 'High' },
  { name: 'Nash County Behavioral Health Collaborative', npi: '1589012345', county: 'Nash', hub: 'Northeast Hub', facilityType: 'BH/LME-MCO', ehr: 'CareLogic', oncEdition: '2015 Edition', hieConnected: false, broadband: '25/3', itStaff: 1, readinessScore: 39, tier: 'NOT READY', confidence: 'Low' },
  { name: 'Blue Ridge Family Health', npi: '1690123456', county: 'Yancey', hub: 'Western Hub', facilityType: 'FQHC', ehr: 'NextGen', oncEdition: '2015 Edition', hieConnected: true, broadband: '100/20', itStaff: 2, readinessScore: 68, tier: 'CONDITIONAL', confidence: 'Medium' },
  { name: 'Sandhills Women’s Health Network', npi: '1701234567', county: 'Moore', hub: 'Sandhills Hub', facilityType: 'RHC', ehr: 'None', oncEdition: null, hieConnected: false, broadband: 'No reliable service', itStaff: 0, readinessScore: 22, tier: 'NOT READY', confidence: 'Low' },
  { name: 'Piedmont Rural Access Clinic', npi: '1812345678', county: 'Randolph', hub: 'Piedmont Hub', facilityType: 'RHC', ehr: 'Athenahealth', oncEdition: '2015 Cures Update', hieConnected: true, broadband: '250/100', itStaff: 4, readinessScore: 76, tier: 'READY', confidence: 'High' },
  { name: 'Surry County Community Hospital', npi: '1923456789', county: 'Surry', hub: 'Northwest Hub', facilityType: 'Hospital', ehr: 'Cerner', oncEdition: '2015 Edition', hieConnected: true, broadband: '100/20', itStaff: 5, readinessScore: 73, tier: 'READY', confidence: 'High' },
  { name: 'Hertford Integrated Care', npi: '1034567890', county: 'Hertford', hub: 'Northeast Hub', facilityType: 'FQHC', ehr: 'Greenway', oncEdition: '2015 Edition', hieConnected: false, broadband: '<25/3', itStaff: 1, readinessScore: 34, tier: 'NOT READY', confidence: 'Medium' },
  { name: 'Caswell County Health Access', npi: '1045678901', county: 'Caswell', hub: 'Piedmont Hub', facilityType: 'FQHC', ehr: 'eClinicalWorks', oncEdition: '2015 Edition', hieConnected: true, broadband: '50/10', itStaff: 2, readinessScore: 58, tier: 'CONDITIONAL', confidence: 'High' },
];

const vendors: Vendor[] = [
  {
    name: 'Epic',
    category: 'EHR',
    score: 8.8,
    status: 'Recommended',
    soc2Expiration: '2027-03-31',
    riskAlerts: 0,
    certifications: ['SOC 2 Type II', 'HIPAA BAA', 'FHIR R4'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 9, weight: '35%' },
      { label: 'Functional', score: 9, weight: '25%' },
      { label: 'Implementation', score: 8, weight: '15%' },
      { label: 'Stability', score: 9, weight: '15%' },
      { label: 'Interoperability', score: 9, weight: '10%' },
    ],
  },
  {
    name: 'Athenahealth',
    category: 'EHR',
    score: 7.9,
    status: 'Recommended',
    soc2Expiration: '2026-12-31',
    riskAlerts: 1,
    certifications: ['SOC 2 Type II', 'HIPAA BAA', 'USCDI'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 8, weight: '35%' },
      { label: 'Functional', score: 8, weight: '25%' },
      { label: 'Implementation', score: 7, weight: '15%' },
      { label: 'Stability', score: 8, weight: '15%' },
      { label: 'Interoperability', score: 8, weight: '10%' },
    ],
  },
  {
    name: 'Zoom for Healthcare',
    category: 'Telehealth',
    score: 7.2,
    status: 'Conditional',
    soc2Expiration: '2026-08-15',
    riskAlerts: 1,
    certifications: ['HIPAA BAA', 'SOC 2 Type II'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 7, weight: '35%' },
      { label: 'Functional', score: 8, weight: '25%' },
      { label: 'Implementation', score: 7, weight: '15%' },
      { label: 'Stability', score: 8, weight: '15%' },
      { label: 'Interoperability', score: 6, weight: '10%' },
    ],
  },
  {
    name: 'Abridge',
    category: 'AI/ML',
    score: 6.4,
    status: 'Flagged',
    soc2Expiration: '2025-12-31',
    riskAlerts: 3,
    certifications: ['HIPAA BAA'],
    breaches24m: 1,
    dimensions: [
      { label: 'Compliance', score: 5, weight: '35%' },
      { label: 'Functional', score: 8, weight: '25%' },
      { label: 'Implementation', score: 6, weight: '15%' },
      { label: 'Stability', score: 6, weight: '15%' },
      { label: 'Interoperability', score: 6, weight: '10%' },
    ],
  },
  {
    name: 'Nuance DAX',
    category: 'AI/ML',
    score: 7.8,
    status: 'Recommended',
    soc2Expiration: '2026-11-30',
    riskAlerts: 0,
    certifications: ['SOC 2 Type II', 'HIPAA BAA', 'Microsoft compliance'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 8, weight: '35%' },
      { label: 'Functional', score: 8, weight: '25%' },
      { label: 'Implementation', score: 7, weight: '15%' },
      { label: 'Stability', score: 8, weight: '15%' },
      { label: 'Interoperability', score: 8, weight: '10%' },
    ],
  },
  {
    name: 'Teladoc',
    category: 'Telehealth',
    score: 7.0,
    status: 'Conditional',
    soc2Expiration: '2026-09-30',
    riskAlerts: 2,
    certifications: ['HIPAA BAA', 'FHIR API'],
    breaches24m: 1,
    dimensions: [
      { label: 'Compliance', score: 7, weight: '35%' },
      { label: 'Functional', score: 7, weight: '25%' },
      { label: 'Implementation', score: 7, weight: '15%' },
      { label: 'Stability', score: 7, weight: '15%' },
      { label: 'Interoperability', score: 7, weight: '10%' },
    ],
  },
  {
    name: 'Validic',
    category: 'RPM',
    score: 7.6,
    status: 'Recommended',
    soc2Expiration: '2026-10-12',
    riskAlerts: 0,
    certifications: ['SOC 2 Type II', 'FHIR R4'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 8, weight: '35%' },
      { label: 'Functional', score: 7, weight: '25%' },
      { label: 'Implementation', score: 7, weight: '15%' },
      { label: 'Stability', score: 8, weight: '15%' },
      { label: 'Interoperability', score: 8, weight: '10%' },
    ],
  },
  {
    name: 'CrowdStrike',
    category: 'Cybersecurity',
    score: 8.4,
    status: 'Recommended',
    soc2Expiration: '2027-01-20',
    riskAlerts: 0,
    certifications: ['FedRAMP Moderate', 'SOC 2 Type II'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 9, weight: '35%' },
      { label: 'Functional', score: 8, weight: '25%' },
      { label: 'Implementation', score: 8, weight: '15%' },
      { label: 'Stability', score: 8, weight: '15%' },
      { label: 'Interoperability', score: 8, weight: '10%' },
    ],
  },
  {
    name: 'Unite Us',
    category: 'Care Coordination',
    score: 6.8,
    status: 'Conditional',
    soc2Expiration: '2026-07-01',
    riskAlerts: 1,
    certifications: ['HIPAA BAA', 'USCDI'],
    breaches24m: 0,
    dimensions: [
      { label: 'Compliance', score: 7, weight: '35%' },
      { label: 'Functional', score: 7, weight: '25%' },
      { label: 'Implementation', score: 6, weight: '15%' },
      { label: 'Stability', score: 7, weight: '15%' },
      { label: 'Interoperability', score: 7, weight: '10%' },
    ],
  },
  {
    name: 'Rural Health Insights Pilot',
    category: 'AI/ML',
    score: null,
    status: 'Under Review',
    soc2Expiration: null,
    riskAlerts: null,
    certifications: [],
    breaches24m: null,
    dimensions: [
      { label: 'Compliance', score: 4, weight: '35%' },
      { label: 'Functional', score: 6, weight: '25%' },
      { label: 'Implementation', score: 5, weight: '15%' },
      { label: 'Stability', score: 3, weight: '15%' },
      { label: 'Interoperability', score: 4, weight: '10%' },
    ],
  },
];

const aiTools: AITool[] = [
  { name: 'ChatGPT Consumer', users: 89, division: 'Cross-agency', dataExposure: 'Unknown — no monitoring or BAA', risk: 'Critical', governance: 'Ungoverned', interactions30d: 3620, nist: [0, 0, 0, 0], action: 'Block access; implement PHI safeguards' },
  { name: 'Microsoft Copilot', users: 74, division: 'Medicaid Operations', dataExposure: 'Email, Word docs, Medicaid correspondence', risk: 'High', governance: 'Ungoverned', interactions30d: 2110, nist: [0, 1, 0, 0], action: 'Implement HIPAA configuration and inventory controls' },
  { name: 'Gemini Workspace', users: 41, division: 'Public Health', dataExposure: 'Draft policies, slide decks, staff communications', risk: 'High', governance: 'Ungoverned', interactions30d: 1480, nist: [0, 0, 0, 0], action: 'Register tool; restrict sensitive uploads' },
  { name: 'Finance Custom GPT', users: 19, division: 'Finance', dataExposure: 'Budget projections, contract analysis', risk: 'High', governance: 'Ungoverned', interactions30d: 820, nist: [0, 1, 0, 0], action: 'Suspend use pending data handling review' },
  { name: 'Nuance DAX', users: 36, division: 'Clinical Programs', dataExposure: 'Clinical encounter transcription with BAA controls', risk: 'Medium', governance: 'Governed', interactions30d: 1190, nist: [2, 2, 1, 2], action: 'Monitored — continue' },
  { name: 'Adobe Firefly', users: 22, division: 'Communications', dataExposure: 'No PHI; public-facing graphics only', risk: 'Low', governance: 'Governed', interactions30d: 540, nist: [2, 1, 2, 2], action: 'Maintain approved use case' },
  { name: 'Claude Web', users: 31, division: 'Policy & Strategy', dataExposure: 'Policy memos, meeting prep, unknown ad hoc uploads', risk: 'High', governance: 'Ungoverned', interactions30d: 610, nist: [0, 0, 0, 1], action: 'Register; enforce prompt/data policy' },
  { name: 'GitHub Copilot', users: 22, division: 'ITD Engineering', dataExposure: 'Code only; no production PHI datasets', risk: 'Medium', governance: 'Ungoverned', interactions30d: 400, nist: [1, 1, 0, 1], action: 'Document approved engineering controls' },
];

const deliverables: Deliverable[] = [
  { name: 'Provider readiness assessment', status: 'Complete', detail: '302 providers scored; statewide tiering methodology documented' },
  { name: 'Regional ROOTS hub comparison', status: 'Complete', detail: '6 hub regions mapped to county and provider counts' },
  { name: 'Vendor evaluation framework', status: 'Complete', detail: '10 vendors evaluated across 5 weighted dimensions' },
  { name: 'AI tool discovery inventory', status: 'Complete', detail: '8 tools, 334 users, 10,770 interactions captured' },
  { name: 'Initiative 6 budget alignment', status: 'Complete', detail: '$35.3M sub-initiative view with findings pinned to each line item' },
  { name: 'Consumer assessment add-on', status: 'Pending', detail: 'Pending — not in current Phase 0 scope' },
  { name: 'DHHS-supplied NC HealthConnex validation', status: 'Pending', detail: 'Awaiting direct participant list from DHHS / HIEA' },
];

const dataSources: DataSourceRecord[] = [
  { name: 'NPPES', url: 'https://npiregistry.cms.hhs.gov/api/', use: 'Provider identity, NPI, organizational records', cadence: 'Daily / weekly' },
  { name: 'ONC CHPL', url: 'https://chpl.healthit.gov/rest/search/v3', use: 'EHR certification verification', cadence: 'Continuous' },
  { name: 'HRSA UDS', url: 'https://data.hrsa.gov/data/datadownload', use: 'FQHC identification and service context', cadence: 'Annual / periodic' },
  { name: 'CMS PI Attestation', url: 'https://data.cms.gov/provider-data', use: 'EHR attestation and product usage', cadence: 'Periodic' },
  { name: 'NIST NVD', url: 'https://services.nvd.nist.gov/rest/json/cves/2.0', use: 'Vendor security alert screening', cadence: 'Daily' },
  { name: 'SAM.gov', url: 'https://api.sam.gov/entity-information/v4/', use: 'Federal registration and exclusions checks', cadence: 'Near real-time' },
  { name: 'HHS OIG LEIE', url: 'https://oig.hhs.gov/exclusions/exclusions_list.asp', use: 'Exclusion screening', cadence: 'Monthly' },
  { name: 'HHS OCR Breach Portal', url: 'https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf', use: 'Breach history over 24 months', cadence: 'Ongoing' },
  { name: 'FCC Broadband Map', url: 'https://broadbandmap.fcc.gov/data-download/nationwide-data', use: 'Broadband availability scoring', cadence: 'Periodic' },
  { name: 'FDA AI/ML Devices', url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices', use: 'AI/ML medical device verification', cadence: 'Periodic' },
];

const initiativeBudget = [
  { id: '6a', name: 'Provider readiness & planning', budget: '$12.8M', finding: '77 providers need foundational support before advanced grants', tone: 'warning' as const },
  { id: '6b', name: 'Advanced modernization awards', budget: '$5.9M', finding: '78 providers currently eligible for higher-complexity modernization', tone: 'success' as const },
  { id: '6c', name: 'Technical assistance & workforce', budget: '$1.6M', finding: 'Not-ready providers require TA-first pathway', tone: 'danger' as const },
  { id: '6d', name: 'Vendor due diligence', budget: '$4.1M', finding: '1 AI vendor flagged; 3 vendors conditional', tone: 'warning' as const },
  { id: '6e', name: 'AI governance controls', budget: '$6.4M', finding: '6 of 8 tools operating without governance controls', tone: 'danger' as const },
  { id: '6f', name: 'Consumer & reporting enablement', budget: '$4.5M', finding: 'Pending — consumer assessment not in current scope', tone: 'default' as const },
];

const deadlines = [
  { label: 'GovRAMP effective date', date: 'Apr 1', tone: 'danger' },
  { label: 'Flagged vendor SOC 2 review', date: 'May 15', tone: 'warning' },
  { label: 'RHIF obligation target', date: 'Jun 30', tone: 'info' },
  { label: 'CMS Year 1 report', date: 'Aug 15', tone: 'info' },
  { label: 'CMS Rural Health Summit', date: 'Sep 10', tone: 'success' },
];

const efficiencyRows = [
  { item: 'Provider readiness assessment', manual: '8–12 weeks / 2 FTEs', platform: '3 days prototype synthesis' },
  { item: 'Vendor due diligence packet', manual: '2–3 weeks / vendor', platform: '2 hours / vendor refresh' },
  { item: 'AI inventory & policy mapping', manual: '4–6 weeks', platform: '1 week structured assessment' },
  { item: 'Audit evidence package', manual: '1–2 weeks', platform: 'Same-day exported provenance set' },
];

function getTierTone(tier: ReadinessTier) {
  if (tier === 'READY') return 'success' as const;
  if (tier === 'CONDITIONAL') return 'warning' as const;
  return 'danger' as const;
}

function getRiskTone(risk: RiskLevel) {
  if (risk === 'Critical') return 'danger' as const;
  if (risk === 'High') return 'warning' as const;
  if (risk === 'Medium') return 'info' as const;
  return 'success' as const;
}

function getVendorTone(status: VendorStatus) {
  if (status === 'Recommended') return 'success' as const;
  if (status === 'Conditional') return 'warning' as const;
  if (status === 'Flagged') return 'danger' as const;
  return 'neutral' as const;
}

function formatValue<T>(value: T | null | undefined, fallback = 'Not available') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

function MetricCard({ title, value, detail, icon: Icon, accent = 'border-brand-sky' }: { title: string; value: string; detail: string; icon: typeof Users; accent?: string }) {
  return (
    <div className={cn('rounded-lg border-l-4 bg-card p-4 shadow-sm', accent, 'border border-border')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
        </div>
        <Icon className="h-8 w-8 text-brand-sky" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function App() {
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('Executive Summary');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(vendors[3] ?? null);

  useEffect(() => {
    if (!selectedVendor && vendors.length > 0) {
      setSelectedVendor(vendors[0]);
    }
  }, [selectedVendor]);

  const filteredProviders = useMemo(() => {
    if (!selectedRegion) return providers;
    return providers.filter((provider) => provider.hub === selectedRegion);
  }, [selectedRegion]);

  const activeRegion = useMemo(
    () => regions.find((region) => region.name === selectedRegion) ?? null,
    [selectedRegion],
  );

  const readinessChartData = [
    { name: 'READY', value: 78, fill: colors.ready },
    { name: 'CONDITIONAL', value: 147, fill: colors.conditional },
    { name: 'NOT READY', value: 77, fill: colors.notReady },
  ];

  const regionalComparison = regions.map((region) => ({
    name: region.name.replace(' Hub', ''),
    ready: Number(region.ready ?? 0),
    conditional: Number(region.conditional ?? 0),
    notReady: Number(region.notReady ?? 0),
  }));

  const renderExecutiveSummary = () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card title="Provider Readiness Summary" subtitle="Phase 0 statewide scoring aligned to Initiative 6 grant allocation decisions.">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-4xl font-semibold text-foreground">302 rural providers assessed</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                The statewide assessment demonstrates a defensible readiness distribution for rural modernization funding. Approximately one-quarter of assessed providers are ready for advanced modernization awards, roughly half require foundational support first, and one-quarter need technical assistance only.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <div className="flex h-7 w-full">
                  <div className="flex items-center justify-center bg-[#789B4A] text-xs font-semibold text-white" style={{ width: '25.8%' }}>READY 78</div>
                  <div className="flex items-center justify-center bg-[#D6A23D] text-xs font-semibold text-white" style={{ width: '48.7%' }}>CONDITIONAL 147</div>
                  <div className="flex items-center justify-center bg-[#B54747] text-xs font-semibold text-white" style={{ width: '25.5%' }}>NOT READY 77</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-secondary p-3">
                  <Badge tone="success">READY</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">Eligible for advanced RHIF modernization grants.</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <Badge tone="warning">CONDITIONAL</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">Need foundational support before advanced grants.</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <Badge tone="danger">NOT READY</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">Technical assistance and planning pathway only.</p>
                </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={readinessChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {readinessChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Providers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card title="RHIF Allocation Recommendation" subtitle="Assessment-backed recommendation for the $20.3M RHIF budget.">
            <div className="space-y-4 text-sm text-foreground">
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3"><span>Advanced modernization</span><strong>$12.8M</strong></div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3"><span>Foundational support</span><strong>$5.9M</strong></div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3"><span>Technical assistance</span><strong>$1.6M</strong></div>
              <p className="text-sm leading-6 text-muted-foreground">Without provider-level scoring, DHHS cannot defensibly allocate RHIF dollars. With this prototype framework, the budget maps directly to readiness tiers and audit-ready criteria.</p>
            </div>
          </Card>
          <MetricCard title="Vendors evaluated" value="10" detail="6 recommended / conditional, 1 flagged, 1 under review" icon={Wallet} />
          <MetricCard title="AI tools ungoverned" value="6 of 8" detail="334 employees; 10,770 unmonitored interactions in 30 days" icon={ShieldAlert} accent="border-red-600" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Critical Finding — AI governance gap',
            detail: '6 discovered tools operate without PHI governance, including unmanaged consumer GenAI access.',
            tone: 'danger' as const,
            tab: 'AI Governance' as TabId,
          },
          {
            title: 'Provider readiness concentration in Northeast',
            detail: '14 not-ready providers are concentrated in the 18-county Northeast Hub with the fewest ready facilities.',
            tone: 'warning' as const,
            tab: 'Regional Map' as TabId,
          },
          {
            title: 'Vendor due diligence prevents weak AI procurement',
            detail: 'Abridge is flagged due to expired controls and active alerts before RHIF dollars flow downstream.',
            tone: 'warning' as const,
            tab: 'Vendor Evaluation' as TabId,
          },
        ].map((finding) => (
          <Card key={finding.title} className={cn('border-t-4', finding.tone === 'danger' ? 'border-t-red-600' : 'border-t-amber-500')}>
            <h3 className="text-lg font-semibold text-foreground">{finding.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{finding.detail}</p>
            <Button className="mt-4" variant="ghost" onClick={() => setActiveTab(finding.tab)} icon={<ArrowRight className="h-4 w-4" />}>
              See {finding.tab} tab
            </Button>
          </Card>
        ))}
      </div>

      <Card title="Initiative 6 Budget Waterfall" subtitle="Each sub-initiative budget line is paired with the most relevant assessment finding.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {initiativeBudget.map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-secondary/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={item.tone}>{item.id.toUpperCase()}</Badge>
                <span className="text-sm font-semibold text-foreground">{item.budget}</span>
              </div>
              <h4 className="mt-3 text-base font-semibold text-foreground">{item.name}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.finding}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Key Deadlines" subtitle="Compliance and program milestones that create urgency for action.">
          <div className="grid gap-4 md:grid-cols-5">
            {deadlines.map((deadline) => (
              <div key={deadline.label} className="relative rounded-lg border border-border bg-secondary p-4">
                <div className="mb-3 h-2 w-full rounded-full bg-border">
                  <div className={cn('h-2 rounded-full', deadline.tone === 'danger' ? 'bg-red-600' : deadline.tone === 'warning' ? 'bg-amber-500' : deadline.tone === 'success' ? 'bg-green-600' : 'bg-sky-600')} style={{ width: '100%' }} />
                </div>
                <p className="text-sm font-semibold text-foreground">{deadline.date}</p>
                <p className="mt-1 text-sm text-muted-foreground">{deadline.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Assessment Efficiency" subtitle="Why DHHS leadership can move faster with an integrated assessment workflow.">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-0 py-2 font-medium">Deliverable</th>
                  <th className="px-0 py-2 font-medium">Manual process</th>
                  <th className="px-0 py-2 font-medium">Platform time</th>
                </tr>
              </thead>
              <tbody>
                {efficiencyRows.map((row) => (
                  <tr key={row.item} className="border-b border-border last:border-0">
                    <td className="py-3 pr-3 text-foreground">{row.item}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{row.manual}</td>
                    <td className="py-3 text-foreground">{row.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRegionalMap = () => (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card title="Interactive ROOTS Hub Map" subtitle="Click a region to compare readiness distribution and drive the Provider Readiness drill-down.">
        <div className="rounded-lg border border-border bg-secondary/50 p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge tone="success">Green = more ready</Badge>
            <Badge tone="warning">Gold = mixed readiness</Badge>
            <Badge tone="danger">Red = concentration of not-ready providers</Badge>
          </div>
          <div className="relative mx-auto h-[32rem] max-w-2xl rounded-lg border border-border bg-card">
            {regions.map((region) => {
              const intensity = Number(region.notReady ?? 0) / Math.max(Number(region.providers ?? 1), 1);
              const background = intensity > 0.28 ? '#b54747' : intensity > 0.22 ? '#d6a23d' : '#789b4a';
              const isSelected = selectedRegion === region.name;
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setSelectedRegion(isSelected ? null : region.name)}
                  className={cn(
                    'absolute rounded-lg border-2 p-3 text-left text-white shadow-sm transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-sky',
                    region.position,
                    isSelected ? 'border-sky-300 ring-2 ring-sky-300' : 'border-white/60',
                  )}
                  style={{ backgroundColor: background }}
                  aria-label={`Select ${region.name}`}
                >
                  <p className="text-sm font-semibold">{region.name}</p>
                  <p className="mt-1 text-xs opacity-90">{region.counties} counties · {region.providers} providers</p>
                  <p className="mt-2 text-xs">{region.ready}/{region.conditional}/{region.notReady}</p>
                </button>
              );
            })}
            <div className="absolute bottom-3 left-3 rounded-md bg-background/90 px-3 py-2 text-xs text-foreground">
              Simplified geographic layout for prototype demonstration; regional comparison only.
            </div>
          </div>
        </div>
      </Card>
      <Card
        title={activeRegion ? `${activeRegion.name} Detail` : 'All Regions Overview'}
        subtitle={activeRegion ? 'Selection persists into the Provider Readiness tab.' : 'No hub selected — viewing statewide regional comparison.'}
        headerAction={
          selectedRegion ? (
            <Button variant="ghost" size="sm" onClick={() => setSelectedRegion(null)}>
              Clear selection
            </Button>
          ) : undefined
        }
      >
        {activeRegion ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Counties</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{activeRegion.counties}</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Providers</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{activeRegion.providers}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Anchor health system</p>
              <p className="mt-1 text-sm text-muted-foreground">{activeRegion.anchorSystem}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span>READY</span><Badge tone="success">{activeRegion.ready}</Badge></div>
              <div className="flex items-center justify-between"><span>CONDITIONAL</span><Badge tone="warning">{activeRegion.conditional}</Badge></div>
              <div className="flex items-center justify-between"><span>NOT READY</span><Badge tone="danger">{activeRegion.notReady}</Badge></div>
              <div className="overflow-hidden rounded-full bg-border">
                <div className="flex h-4 w-full">
                  <div className="bg-[#789B4A]" style={{ width: `${(activeRegion.ready / activeRegion.providers) * 100}%` }} />
                  <div className="bg-[#D6A23D]" style={{ width: `${(activeRegion.conditional / activeRegion.providers) * 100}%` }} />
                  <div className="bg-[#B54747]" style={{ width: `${(activeRegion.notReady / activeRegion.providers) * 100}%` }} />
                </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab('Provider Readiness')} icon={<ArrowRight className="h-4 w-4" />}>
              Open Provider Readiness for this hub
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ready" stackId="a" fill={colors.ready} />
                  <Bar dataKey="conditional" stackId="a" fill={colors.conditional} />
                  <Bar dataKey="notReady" stackId="a" fill={colors.notReady} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Northeast Hub has the lowest ready count relative to its 18-county footprint. Western and Piedmont regions show stronger advanced modernization capacity.
            </p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderProviderReadiness = () => (
    <div className="space-y-6">
      <Card
        title="Provider Readiness Assessment"
        subtitle="Provider-level comparison designed for RHIF allocation, technical assistance prioritization, and audit review."
        headerAction={<Badge tone="info">Filter persists from Regional Map</Badge>}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button variant={selectedRegion === null ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedRegion(null)} icon={<Filter className="h-4 w-4" />}>
            All Hubs
          </Button>
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion === region.name ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion(region.name)}
            >
              {region.name}
            </Button>
          ))}
        </div>
        {filteredProviders.length === 0 ? (
          <EmptyState icon={Database} title="No providers available for this filter" description="Static prototype data for the selected region is unavailable. Clear the filter to restore the statewide comparison set." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  {['Provider', 'NPI', 'County', 'ROOTS Hub', 'Type', 'EHR', 'ONC', 'HIE', 'Broadband', 'IT Staff', 'Score', 'Tier'].map((heading) => (
                    <th key={heading} className="px-2 py-3 font-medium first:pl-0">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => {
                  const score = Number(provider.readinessScore ?? 0);
                  return (
                    <tr key={`${provider.npi}-${provider.name}`} className="border-b border-border align-top last:border-0">
                      <td className="py-3 pl-0 pr-2 font-medium text-foreground">{provider.name}</td>
                      <td className="px-2 py-3 text-muted-foreground">{provider.npi}</td>
                      <td className="px-2 py-3 text-muted-foreground">{provider.county}</td>
                      <td className="px-2 py-3 text-muted-foreground">{provider.hub}</td>
                      <td className="px-2 py-3 text-muted-foreground">{provider.facilityType}</td>
                      <td className={cn('px-2 py-3', !provider.ehr || provider.ehr === 'None' ? 'font-semibold text-red-700 dark:text-red-300' : 'text-foreground')}>{formatValue(provider.ehr, 'None')}</td>
                      <td className="px-2 py-3 text-muted-foreground">{formatValue(provider.oncEdition, 'No attestation')}</td>
                      <td className="px-2 py-3">{provider.hieConnected === true ? <Badge tone="success">Yes</Badge> : provider.hieConnected === false ? <Badge tone="danger">No</Badge> : <Badge tone="neutral">Unknown</Badge>}</td>
                      <td className="px-2 py-3 text-muted-foreground">{formatValue(provider.broadband)}</td>
                      <td className={cn('px-2 py-3', Number(provider.itStaff ?? 0) === 0 ? 'font-semibold text-red-700 dark:text-red-300' : 'text-foreground')}>{formatValue(provider.itStaff, 'Unknown')}</td>
                      <td className="px-2 py-3">
                        <div className="w-28">
                          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground"><span>{score}</span><span>{provider.confidence}</span></div>
                          <div className="h-2 overflow-hidden rounded-full bg-border">
                            <div
                              className={cn('h-2 rounded-full', provider.tier === 'READY' ? 'bg-green-600' : provider.tier === 'CONDITIONAL' ? 'bg-amber-500' : 'bg-red-600')}
                              style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3"><Badge tone={getTierTone(provider.tier)}>{provider.tier}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card title="Scoring provenance" subtitle="Every provider score traces to public or DHHS-verifiable data sources documented for audit review.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            'NPPES — provider identity and organizational NPI records',
            'HRSA UDS — FQHC identification and service delivery context',
            'ONC CHPL — certified EHR verification and edition checks',
            'FCC BDC — broadband availability thresholds for readiness scoring',
            'CMS PECOS / PI Attestation — EHR usage and participation proxies',
            'NC HealthConnex participant list — HIE connectivity validation (pending DHHS source confirmation)',
          ].map((source) => (
            <div key={source} className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">{source}</div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderVendorEvaluation = () => (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card title="Vendor Evaluation" subtitle="10 vendors assessed across compliance, functional fit, implementation readiness, stability, and interoperability.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {['Vendor', 'Category', 'Score', 'Status', 'SOC 2 Type II', 'Risk Alerts'].map((heading) => (
                  <th key={heading} className="px-2 py-3 font-medium first:pl-0">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor.name}
                  className={cn('cursor-pointer border-b border-border transition-colors hover:bg-secondary/60 last:border-0', selectedVendor?.name === vendor.name ? 'bg-secondary/70' : '')}
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <td className="py-3 pl-0 pr-2 font-medium text-foreground">{vendor.name}</td>
                  <td className="px-2 py-3 text-muted-foreground">{vendor.category}</td>
                  <td className="px-2 py-3 text-foreground">{vendor.score === null ? 'N/A' : vendor.score.toFixed(1)}</td>
                  <td className="px-2 py-3"><Badge tone={getVendorTone(vendor.status)}>{vendor.status}</Badge></td>
                  <td className={cn('px-2 py-3', vendor.status === 'Flagged' ? 'font-semibold text-red-700 dark:text-red-300' : 'text-muted-foreground')}>
                    {vendor.soc2Expiration ? `${vendor.soc2Expiration}${vendor.status === 'Flagged' ? ' · Expired' : ''}` : 'Not available'}
                  </td>
                  <td className="px-2 py-3 text-foreground">{formatValue(vendor.riskAlerts, 'N/A')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title={selectedVendor ? `${selectedVendor.name} Detail` : 'Vendor Detail'} subtitle="5-dimension breakdown aligned to the Phase 0 due diligence framework.">
        {selectedVendor ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={getVendorTone(selectedVendor.status)}>{selectedVendor.status}</Badge>
              <Badge tone="info">Score {selectedVendor.score === null ? 'N/A' : selectedVendor.score.toFixed(1)}</Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={selectedVendor.dimensions} outerRadius={90}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} />
                  <Radar name="Score" dataKey="score" stroke={colors.sky} fill={colors.sky} fillOpacity={0.35} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {selectedVendor.dimensions.map((dimension) => (
                <div key={dimension.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{dimension.label}</span>
                    <span className="text-muted-foreground">{dimension.score}/10 · {dimension.weight}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-2 rounded-full bg-sky-700" style={{ width: `${dimension.score * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Verified certifications</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedVendor.certifications.length > 0 ? selectedVendor.certifications.map((cert) => <Badge key={cert} tone="success">{cert}</Badge>) : <Badge tone="neutral">No verified certifications</Badge>}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">HHS OCR breaches (24 mo.)</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{formatValue(selectedVendor.breaches24m, 'N/A')}</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Active risk alerts</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{formatValue(selectedVendor.riskAlerts, 'N/A')}</p>
              </div>
            </div>
            {selectedVendor.name === 'Abridge' ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                Abridge is intentionally shown as the flagged AI/ML vendor in this Phase 0 demo: expired SOC 2 posture, 3 active risk alerts, and limited certifications create a visible procurement caution before RHIF dollars are allocated.
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState icon={ShieldCheck} title="Select a vendor" description="Choose a vendor row to inspect the weighted due diligence breakdown and supporting risk indicators." />
        )}
      </Card>
    </div>
  );

  const renderAIGovernance = () => (
    <div className="space-y-6">
      <Card className="border-red-200 dark:border-red-900" title="Critical AI Governance Alert" subtitle="This is the current measurable compliance exposure highlighted for the DHHS CISO review.">
        <div className="rounded-lg bg-red-50 p-5 text-red-900 dark:bg-red-950 dark:text-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold">6 of 8 AI tools operating without PHI governance.</p>
              <p className="mt-2 text-sm leading-6">
                334 employees generated 10,770 recorded interactions over 30 days across the prototype inventory. The assessment maps this gap to the 2024 NC Executive Order on AI use and NIST AI RMF accountability expectations.
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card title="AI Tool Registry" subtitle="Governance status, data exposure, and NIST AI RMF alignment indicators by discovered tool.">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {['Tool', 'Users', 'Division', 'Data Exposure', 'PHI Risk', 'Governance', '30-day Interactions', 'NIST AI RMF', 'Recommended Action'].map((heading) => (
                  <th key={heading} className="px-2 py-3 font-medium first:pl-0">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aiTools.map((tool) => (
                <tr key={tool.name} className="border-b border-border align-top last:border-0">
                  <td className="py-3 pl-0 pr-2 font-medium text-foreground">{tool.name}</td>
                  <td className="px-2 py-3 text-foreground">{formatValue(tool.users, 'N/A')}</td>
                  <td className="px-2 py-3 text-muted-foreground">{tool.division}</td>
                  <td className="px-2 py-3 text-muted-foreground">{formatValue(tool.dataExposure)}</td>
                  <td className="px-2 py-3"><Badge tone={getRiskTone(tool.risk)}>{tool.risk}</Badge></td>
                  <td className="px-2 py-3">{tool.governance === 'Governed' ? <Badge tone="success">Governed</Badge> : <Badge tone="danger">Ungoverned</Badge>}</td>
                  <td className="px-2 py-3 text-foreground">{formatValue(tool.interactions30d, 'N/A')}</td>
                  <td className="px-2 py-3">
                    <div className="flex gap-2" aria-label={`NIST AI RMF alignment for ${tool.name}`}>
                      {tool.nist.map((status, index) => (
                        <span
                          key={`${tool.name}-${index}`}
                          title={['Govern', 'Map', 'Measure', 'Manage'][index]}
                          className={cn(
                            'h-3 w-3 rounded-full',
                            status === 2 ? 'bg-green-600' : status === 1 ? 'bg-amber-500' : 'bg-red-600',
                          )}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">{tool.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderAuditProvenance = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card title="Deliverable Completion Status" subtitle="Project status, scope boundaries, and evidence package milestones.">
        <div className="space-y-3">
          {deliverables.map((deliverable) => (
            <div key={deliverable.name} className="rounded-lg border border-border bg-secondary/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{deliverable.name}</h3>
                <Badge tone={deliverable.status === 'Complete' ? 'success' : 'warning'}>{deliverable.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{deliverable.detail}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Federal Data Sources with URLs" subtitle="Every score and finding in this prototype traces to public or DHHS-verifiable source systems.">
        <div className="space-y-3">
          {dataSources.map((source) => (
            <div key={source.name} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{source.name}</h3>
                  <p className="mt-1 break-all text-xs text-brand-sky">{source.url}</p>
                </div>
                <Badge tone="info">{source.cadence}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{source.use}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
          Zero proprietary data required — all independently verifiable through public federal or DHHS-supplied source systems.
        </div>
      </Card>
    </div>
  );

  return (
    <BaseLayout darkMode={darkMode} onToggleTheme={toggleTheme}>
      <div className="space-y-6">
        <PrototypeNotice />
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-title">Demo narrative flow</p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                This Phase 0 browser prototype is structured for a live executive walkthrough: statewide summary, geographic concentration, provider drill-down, vendor due diligence, AI governance exposure, and audit-ready provenance.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button key={tab} variant={activeTab === tab ? 'primary' : 'outline'} size="sm" onClick={() => setActiveTab(tab)}>
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {activeTab === 'Executive Summary' && renderExecutiveSummary()}
        {activeTab === 'Regional Map' && renderRegionalMap()}
        {activeTab === 'Provider Readiness' && renderProviderReadiness()}
        {activeTab === 'Vendor Evaluation' && renderVendorEvaluation()}
        {activeTab === 'AI Governance' && renderAIGovernance()}
        {activeTab === 'Audit & Provenance' && renderAuditProvenance()}

        <StyleGuide />
      </div>
    </BaseLayout>
  );
}
