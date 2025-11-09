export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface User {
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
}
