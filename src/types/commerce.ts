export type VerticalId =
  | 'seguridad'
  | 'redes'
  | 'energia'
  | 'computo'
  | 'iluminacion'
  | 'radiocom';

export type StockStatus = 'in_stock' | 'low_stock' | 'on_demand';

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  verticalId: VerticalId;
  specs: string;
  priceMxn: number;
  distributorDiscountPct: number;
  stockStatus: StockStatus;
  badge?: string;
}

export interface VerticalCategory {
  id: VerticalId;
  index: string;
  label: string;
  shortLabel: string;
  headline: string;
  description: string;
  telemetryTag: string;
  keyMetrics: { label: string; value: string }[];
  brands: string[];
  featuredSkus: string[];
}

export interface FlagshipSystem {
  id: string;
  code: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  theme: 'light' | 'dark';
  specs: { label: string; value: string }[];
  componentsIncluded: string[];
  priceMxn: number;
  badge: string;
}

export interface PartnerBrand {
  id: string;
  name: string;
  specialty: string;
  skuCount: string;
  verticalId: VerticalId;
  tier: 'Strategic' | 'Enterprise' | 'Certified';
}

export interface BoxCartItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  specs: string;
  priceMxn: number;
  distributorDiscountPct: number;
  quantity: number;
  kind: 'product' | 'system';
}

export interface DistributorLeadInput {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  primaryVertical: VerticalId;
  monthlyVolume?: string;
}

export interface QuoteSubmissionResult {
  referenceId: string;
  createdAtIso: string;
  itemCount: number;
  estimatedTotalMxn: number;
}

export interface CatalogProvider {
  readonly mode: 'mock' | 'wix-headless';
  listProducts: (filter?: { verticalId?: VerticalId; brand?: string; query?: string }) => Promise<CatalogProduct[]>;
  listVerticals: () => Promise<VerticalCategory[]>;
  listFlagshipSystems: () => Promise<FlagshipSystem[]>;
  listBrands: () => Promise<PartnerBrand[]>;
  submitDistributorLead: (lead: DistributorLeadInput) => Promise<{ accepted: boolean; ticketId: string }>;
  createBoxQuote: (items: BoxCartItem[], useDistributorPricing: boolean) => Promise<QuoteSubmissionResult>;
}
