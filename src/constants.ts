import { Product } from './types';

export const PRODUCTS_PER_PAGE = 8;

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Premium Coffee Beans', price: 18.50, imageUrl: 'https://picsum.photos/seed/coffee/400/300', category: 'Beverages' },
  { id: 2, name: 'Artisanal Bread Loaf', price: 5.25, imageUrl: 'https://picsum.photos/seed/bread/400/300', category: 'Bakery' },
  { id: 3, name: 'Organic Green Tea', price: 12.00, imageUrl: 'https://picsum.photos/seed/tea/400/300', category: 'Beverages' },
  { id: 4, name: 'Gourmet Chocolate Bar', price: 7.99, imageUrl: 'https://picsum.photos/seed/chocolate/400/300', category: 'Confectionery' },
  { id: 5, name: 'Vintage Leather Journal', price: 25.00, imageUrl: 'https://picsum.photos/seed/journal/400/300', category: 'Stationery' },
  { id: 6, name: 'Scented Soy Candle', price: 15.75, imageUrl: 'https://picsum.photos/seed/candle/400/300', category: 'Home Goods' },
  { id: 7, name: 'Stainless Steel Water Bottle', price: 22.00, imageUrl: 'https://picsum.photos/seed/bottle/400/300', category: 'Accessories' },
  { id: 8, name: 'Handcrafted Wooden Bowl', price: 35.50, imageUrl: 'https://picsum.photos/seed/bowl/400/300', category: 'Home Goods' },
  { id: 9, name: 'Designer Sunglasses', price: 150.00, imageUrl: 'https://picsum.photos/seed/sunglasses/400/300', category: 'Accessories' },
  { id: 10, name: 'Cashmere Scarf', price: 89.99, imageUrl: 'https://picsum.photos/seed/scarf/400/300', category: 'Apparel' },
  { id: 11, name: 'Ceramic Coffee Mug', price: 14.00, imageUrl: 'https://picsum.photos/seed/mug/400/300', category: 'Home Goods' },
  { id: 12, name: 'Spicy Mango Chutney', price: 8.50, imageUrl: 'https://picsum.photos/seed/chutney/400/300', category: 'Pantry' },
  { id: 13, name: 'Classic Fountain Pen', price: 45.00, imageUrl: 'https://picsum.photos/seed/pen/400/300', category: 'Stationery' },
  { id: 14, name: 'Natural Olive Oil Soap', price: 6.20, imageUrl: 'https://picsum.photos/seed/soap/400/300', category: 'Bath & Body' },
  { id: 15, name: 'Linen Throw Pillow', price: 30.00, imageUrl: 'https://picsum.photos/seed/pillow/400/300', category: 'Home Goods' },
  { id: 16, name: 'Exotic Spice Blend', price: 9.75, imageUrl: 'https://picsum.photos/seed/spice/400/300', category: 'Pantry' },
  { id: 17, name: 'Minimalist Wall Clock', price: 55.00, imageUrl: 'https://picsum.photos/seed/clock/400/300', category: 'Home Goods' },
  { id: 18, name: 'Herbal Infusion Tea Set', price: 28.00, imageUrl: 'https://picsum.photos/seed/teaset/400/300', category: 'Beverages' },
  { id: 19, name: 'Canvas Tote Bag', price: 19.99, imageUrl: 'https://picsum.photos/seed/tote/400/300', category: 'Accessories' },
  { id: 20, name: 'Dark Roast Espresso Pods', price: 16.49, imageUrl: 'https://picsum.photos/seed/espresso/400/300', category: 'Beverages' },
];

export const FEATURED_PRODUCTS_IDS = [1, 4, 9, 7];
