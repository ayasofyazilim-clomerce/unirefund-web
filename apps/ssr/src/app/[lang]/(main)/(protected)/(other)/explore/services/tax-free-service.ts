import type {TaxFreePoint} from "../types";

// Mock data for tax-free points
export const MOCK_TAX_FREE_POINTS: TaxFreePoint[] = [
  {
    id: 1,
    name: "Galeries Lafayette",
    address: "40 Boulevard Haussmann, 75009 Paris, France",
    category: "Department Store",
    rating: 4.5,
    position: {lat: 48.8738, lng: 2.3322},
    returnRate: 12,
  },
  {
    id: 2,
    name: "Printemps",
    address: "64 Boulevard Haussmann, 75009 Paris, France",
    category: "Department Store",
    rating: 4.3,
    position: {lat: 48.8752, lng: 2.3288},
    returnRate: 10,
  },
  {
    id: 3,
    name: "Le Bon Marché",
    address: "24 Rue de Sèvres, 75007 Paris, France",
    category: "Department Store",
    rating: 4.6,
    position: {lat: 48.8512, lng: 2.3264},
    returnRate: 15,
  },
];

/**
 * This is a mock service for fetching tax-free points.
 * In a real application, this would be replaced with actual API calls.
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
