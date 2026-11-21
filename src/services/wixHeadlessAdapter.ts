import {
  CATALOG_PRODUCTS,
  FLAGSHIP_SYSTEMS,
  PARTNER_BRANDS,
  VERTICALS,
} from '../data/catalog';
import {
  BoxCartItem,
  CatalogProduct,
  CatalogProvider,
  DistributorLeadInput,
  FlagshipSystem,
  PartnerBrand,
  QuoteSubmissionResult,
  VerticalCategory,
  VerticalId,
} from '../types/commerce';

/**
 * Configuración para la Etapa 2: Wix Headless (@wix/sdk + @wix/stores + @wix/ecom).
 * Mantener las variables de entorno VITE_WIX_CLIENT_ID y VITE_WIX_SITE_ID permite
 * conmutar de mockCatalogProvider a wixHeadlessProvider sin modificar componentes UI.
 */
export interface WixHeadlessConfig {
  clientId?: string;
  siteId?: string;
  apiBaseUrl?: string;
}

const computeTotal = (items: BoxCartItem[], useDistributorPricing: boolean): number =>
  items.reduce((acc, item) => {
    const unitPrice = useDistributorPricing
      ? Math.round(item.priceMxn * (1 - item.distributorDiscountPct / 100))
      : item.priceMxn;
    return acc + unitPrice * item.quantity;
  }, 0);

export const mockCatalogProvider: CatalogProvider = {
  mode: 'mock',

  async listProducts(filter?: {
    verticalId?: VerticalId;
    brand?: string;
    query?: string;
  }): Promise<CatalogProduct[]> {
    let results = [...CATALOG_PRODUCTS];
    if (filter?.verticalId) {
      results = results.filter((item) => item.verticalId === filter.verticalId);
    }
    if (filter?.brand) {
      const normalizedBrand = filter.brand.toLowerCase();
      results = results.filter((item) => item.brand.toLowerCase().includes(normalizedBrand));
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.specs.toLowerCase().includes(q),
      );
    }
    return results;
  },

  async listVerticals(): Promise<VerticalCategory[]> {
    return VERTICALS;
  },

  async listFlagshipSystems(): Promise<FlagshipSystem[]> {
    return FLAGSHIP_SYSTEMS;
  },

  async listBrands(): Promise<PartnerBrand[]> {
    return PARTNER_BRANDS;
  },

  async submitDistributorLead(
    _lead: DistributorLeadInput,
  ): Promise<{ accepted: boolean; ticketId: string }> {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return {
      accepted: true,
      ticketId: `PB-DIST-${suffix}`,
    };
  },

  async createBoxQuote(
    items: BoxCartItem[],
    useDistributorPricing: boolean,
  ): Promise<QuoteSubmissionResult> {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      referenceId: `PB-2026-${suffix}`,
      createdAtIso: new Date().toISOString(),
      itemCount,
      estimatedTotalMxn: computeTotal(items, useDistributorPricing),
    };
  },
};

/**
 * Stage 2 factory:
 * When VITE_WIX_CLIENT_ID is configured, instantiate `@wix/sdk` with OAuthStrategy
 * and bind `products.queryProducts()`, `collections.queryCollections()`, and `currentCart` / `checkout`.
 */
export function createCatalogProvider(_config?: WixHeadlessConfig): CatalogProvider {
  // Stage 2 hook: if (config?.clientId) return createWixSdkProvider(config);
  return mockCatalogProvider;
}

export const catalogProvider = createCatalogProvider({
  clientId: import.meta.env.VITE_WIX_CLIENT_ID as string | undefined,
  siteId: import.meta.env.VITE_WIX_SITE_ID as string | undefined,
});
