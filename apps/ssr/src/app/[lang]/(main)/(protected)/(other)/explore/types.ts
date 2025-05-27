export type TaxFreePoint = {
  id: number;
  name: string;
  address: string;
  category: string;
  rating: number;
  position: {lat: number; lng: number};
  returnRate: number;
};
