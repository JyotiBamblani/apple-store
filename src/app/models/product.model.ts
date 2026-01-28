/** Product model for storefront (carousel, cards, buy popup) */
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}
