import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BoxCartItem,
  CatalogProduct,
  FlagshipSystem,
} from '../types/commerce';

interface BoxContextValue {
  items: BoxCartItem[];
  itemCount: number;
  subtotalMxn: number;
  distributorTotalMxn: number;
  isDistributorPricing: boolean;
  setIsDistributorPricing: (value: boolean) => void;
  addProduct: (product: CatalogProduct) => void;
  addFlagshipSystem: (system: FlagshipSystem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearBox: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isSearchOpen: boolean;
  searchInitialQuery: string;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  isDistributorModalOpen: boolean;
  openDistributorModal: () => void;
  closeDistributorModal: () => void;
  lastAddedId: string | null;
}

const BoxContext = createContext<BoxContextValue | null>(null);

export const BoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BoxCartItem[]>([
    {
      id: 'prod-04',
      sku: 'UBQ-USW-PROMAX48',
      name: 'Switch UniFi Pro Max 48 Puertos L3 PoE++ 720W',
      brand: 'Ubiquiti',
      specs: '16x 2.5GbE + 32x GbE + 4x 10G SFP+',
      priceMxn: 29900,
      distributorDiscountPct: 14,
      quantity: 1,
      kind: 'product',
    },
  ]);

  const [isDistributorPricing, setIsDistributorPricing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const pulseAdded = useCallback((id: string) => {
    setLastAddedId(id);
    window.setTimeout(() => {
      setLastAddedId((current) => (current === id ? null : current));
    }, 1500);
  }, []);

  const addProduct = useCallback(
    (product: CatalogProduct) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            sku: product.sku,
            name: product.name,
            brand: product.brand,
            specs: product.specs,
            priceMxn: product.priceMxn,
            distributorDiscountPct: product.distributorDiscountPct,
            quantity: 1,
            kind: 'product',
          },
        ];
      });
      pulseAdded(product.id);
    },
    [pulseAdded],
  );

  const addFlagshipSystem = useCallback(
    (system: FlagshipSystem) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === system.id);
        if (existing) {
          return prev.map((i) =>
            i.id === system.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [
          ...prev,
          {
            id: system.id,
            sku: system.code,
            name: system.title,
            brand: 'PROJECT BOX SYSTEM',
            specs: system.componentsIncluded.slice(0, 2).join(' · '),
            priceMxn: system.priceMxn,
            distributorDiscountPct: 16,
            quantity: 1,
            kind: 'system',
          },
        ];
      });
      pulseAdded(system.id);
      setIsDrawerOpen(true);
    },
    [pulseAdded],
  );

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearBox = useCallback(() => setItems([]), []);

  const openSearch = useCallback((initialQuery = '') => {
    setSearchInitialQuery(initialQuery);
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchInitialQuery('');
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsDrawerOpen(false);
        setIsDistributorModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotalMxn = useMemo(
    () => items.reduce((sum, item) => sum + item.priceMxn * item.quantity, 0),
    [items],
  );

  const distributorTotalMxn = useMemo(
    () =>
      items.reduce((sum, item) => {
        const discounted = Math.round(
          item.priceMxn * (1 - item.distributorDiscountPct / 100),
        );
        return sum + discounted * item.quantity;
      }, 0),
    [items],
  );

  const value = useMemo<BoxContextValue>(
    () => ({
      items,
      itemCount,
      subtotalMxn,
      distributorTotalMxn,
      isDistributorPricing,
      setIsDistributorPricing,
      addProduct,
      addFlagshipSystem,
      updateQuantity,
      removeItem,
      clearBox,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      isSearchOpen,
      searchInitialQuery,
      openSearch,
      closeSearch,
      isDistributorModalOpen,
      openDistributorModal: () => setIsDistributorModalOpen(true),
      closeDistributorModal: () => setIsDistributorModalOpen(false),
      lastAddedId,
    }),
    [
      items,
      itemCount,
      subtotalMxn,
      distributorTotalMxn,
      isDistributorPricing,
      addProduct,
      addFlagshipSystem,
      updateQuantity,
      removeItem,
      clearBox,
      isDrawerOpen,
      isSearchOpen,
      searchInitialQuery,
      openSearch,
      closeSearch,
      isDistributorModalOpen,
      lastAddedId,
    ],
  );

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>;
};

export function useBox(): BoxContextValue {
  const ctx = useContext(BoxContext);
  if (!ctx) {
    throw new Error('useBox debe utilizarse dentro de BoxProvider');
  }
  return ctx;
}
