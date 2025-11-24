export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

let products: Product[] = [
  { id: 1, name: "Produto A", price: 10 },
  { id: 2, name: "Produto B", price: 20 },
];

export function getProducts() {
  return products;
}
