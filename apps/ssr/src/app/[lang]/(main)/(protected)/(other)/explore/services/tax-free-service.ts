import type {TaxFreePoint} from "../types";

// Real tax-free points data from Istanbul Airport
export const MOCK_TAX_FREE_POINTS: TaxFreePoint[] = [
  {
    id: 1,
    name: "Mavi - İstanbul Havalimanı",
    address: "Tayakadın Terminal Caddesi No:1 F1, D:26, 34277 Arnavutköy/İstanbul",
    category: "Clothing Store",
    rating: 4.2,
    position: {lat: 41.2611789, lng: 28.739211},
    returnRate: 18,
  },
  {
    id: 2,
    name: "LC Waikiki - İstanbul Havalimanı",
    address: "İmrahor, 34275 Arnavutköy/İstanbul",
    category: "Clothing Store",
    rating: 4.1,
    position: {lat: 41.2592223, lng: 28.7430112},
    returnRate: 15,
  },
  {
    id: 3,
    name: "Beymen Club - İstanbul Havalimanı",
    address: "Tayakadın, Terminal Caddesi No:1, 34283 Arnavutköy/İstanbul",
    category: "Department Store",
    rating: 4.7,
    position: {lat: 41.2616059, lng: 28.7441219},
    returnRate: 20,
  },
];

/**
 * Tax-free service providing real data from Istanbul Airport shopping locations.
 * Currently includes Mavi, Defacto, and Beymen Club stores.
 */
export const taxFreeService = {
  /**
   * Get all tax-free points
   */
  getAll: async (): Promise<TaxFreePoint[]> => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    return MOCK_TAX_FREE_POINTS;
  },

  /**
   * Get a tax-free point by ID
   */
  getById: async (id: number): Promise<TaxFreePoint | undefined> => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });
    return MOCK_TAX_FREE_POINTS.find((point) => point.id === id);
  },

  /**
   * Search tax-free points by query
   */
  search: async (query: string): Promise<TaxFreePoint[]> => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 400);
    });
    if (!query) {
      return MOCK_TAX_FREE_POINTS;
    }

    const lowerQuery = query.toLowerCase();
    return MOCK_TAX_FREE_POINTS.filter(
      (point) => point.name.toLowerCase().includes(lowerQuery) || point.address.toLowerCase().includes(lowerQuery),
    );
  },
};
