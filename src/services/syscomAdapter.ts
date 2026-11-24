import { CatalogProduct, StockStatus, VerticalId } from '../types/commerce';

/**
 * Configuración para la Etapa 2: Sincronización con SYSCOM México API REST v1.
 * Documentación oficial: https://developers.syscom.mx/
 * Flujo recomendado: Proxy backend / Wix Velo backend calls OAuth2 client_credentials
 * (client_id + client_secret) hacia https://developers.syscom.mx/oauth/token y consulta /api/v1/.
 */
export interface SyscomAuthConfig {
  clientId?: string;
  clientSecret?: string;
  oauthTokenUrl: string;
  apiBaseUrl: string;
}

export const DEFAULT_SYSCOM_CONFIG: SyscomAuthConfig = {
  oauthTokenUrl: 'https://developers.syscom.mx/oauth/token',
  apiBaseUrl: 'https://developers.syscom.mx/api/v1',
};

export interface SyscomRawCategory {
  id: string;
  nombre: string;
  nivel: number;
}

export interface SyscomRawProduct {
  producto_id: string;
  modelo: string;
  titulo: string;
  marca: string;
  sat_key?: string;
  img_portada?: string;
  categorias?: SyscomRawCategory[];
  existencia?: {
    nuevo?: number;
  };
  total_existencia?: number;
  precios?: {
    precio_1?: string | number;
    precio_especial?: string | number;
    precio_descuento?: string | number;
    precio_lista?: string | number;
  };
}

const inferVerticalFromCategories = (
  categories: SyscomRawCategory[] = [],
  title = '',
): VerticalId => {
  const haystack = `${categories.map((c) => c.nombre).join(' ')} ${title}`.toLowerCase();
  if (haystack.includes('video') || haystack.includes('cctv') || haystack.includes('acceso') || haystack.includes('alarma') || haystack.includes('fuego')) {
    return 'seguridad';
  }
  if (haystack.includes('red') || haystack.includes('switch') || haystack.includes('router') || haystack.includes('wi-fi') || haystack.includes('fibra') || haystack.includes('cableado')) {
    return 'redes';
  }
  if (haystack.includes('solar') || haystack.includes('energ') || haystack.includes('ups') || haystack.includes('bater') || haystack.includes('inversor')) {
    return 'energia';
  }
  if (haystack.includes('radio') || haystack.includes('audio') || haystack.includes('voceo') || haystack.includes('dmr')) {
    return 'radiocom';
  }
  if (haystack.includes('ilumin') || haystack.includes('led') || haystack.includes('luminaria')) {
    return 'iluminacion';
  }
  return 'computo';
};

const parseStockStatus = (totalStock: number): StockStatus => {
  if (totalStock > 5) return 'in_stock';
  if (totalStock > 0) return 'low_stock';
  return 'on_demand';
};

/**
 * Convierte un producto crudo de `/api/v1/productos` de SYSCOM al esquema interno de PROJECT BOX.
 * En SYSCOM los precios base suelen venir en USD; `fxUsdToMxn` permite normalizar a MXN al vuelo.
 */
export function mapSyscomProductToCatalog(
  raw: SyscomRawProduct,
  fxUsdToMxn = 19.5,
): CatalogProduct {
  const totalStock = raw.total_existencia ?? raw.existencia?.nuevo ?? 0;
  const rawListPrice = Number(raw.precios?.precio_lista ?? raw.precios?.precio_1 ?? 0);
  const rawSpecialPrice = Number(
    raw.precios?.precio_descuento ?? raw.precios?.precio_especial ?? rawListPrice,
  );

  const priceMxn = Math.max(0, Math.round(rawListPrice * fxUsdToMxn));
  const discountPct =
    rawListPrice > 0 && rawSpecialPrice > 0 && rawSpecialPrice < rawListPrice
      ? Math.round(((rawListPrice - rawSpecialPrice) / rawListPrice) * 100)
      : 15;

  return {
    id: `syscom-${raw.producto_id}`,
    sku: raw.modelo,
    name: raw.titulo,
    brand: raw.marca,
    verticalId: inferVerticalFromCategories(raw.categorias, raw.titulo),
    specs: raw.categorias?.map((c) => c.nombre).slice(0, 3).join(' · ') || 'Catálogo certificado',
    priceMxn,
    distributorDiscountPct: Math.min(35, Math.max(8, discountPct)),
    stockStatus: parseStockStatus(totalStock),
    badge: totalStock > 10 ? 'Stock Real' : undefined,
  };
}
