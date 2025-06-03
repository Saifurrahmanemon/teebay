// TODO: move types to a separate package

export type Category =
  | 'ELECTRONICS'
  | 'FURNITURE'
  | 'HOME_APPLIANCES'
  | 'SPORTING_GOODS'
  | 'OUTDOOR'
  | 'TOYS';

export type RentPeriod = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface User {
  id: number;
  email: string;
  password: string; // You may want to omit this from frontend usage
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt: string; // ISO string format
  updatedAt: string;
  products: Product[];
  sales: Sale[];
  purchases: Sale[];
  rentalsOut: Rental[];
  rentalsIn: Rental[];
  ProductFormSession: ProductFormSession[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rentPrice: number;
  categories: Category[];
  rentPeriod: RentPeriod;
  userId: number;
  user: User;
  sales: Sale[];
  rentals: Rental[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isAvailable: boolean;
}

export interface Sale {
  id: number;
  productId: number;
  product: Product;
  buyerId: number;
  buyer: User;
  sellerId: number;
  seller: User;
  createdAt: string;
}

export interface Rental {
  id: number;
  productId: number;
  product: Product;
  lenderId: number;
  lender: User;
  borrowerId: number;
  borrower: User;
  fromDate: string;
  toDate: string;
  createdAt: string;
}

export interface ProductFormSession {
  id: string;
  userId: number;
  user: User;
  step: number;
  formData: Record<string, any>; // Use a more specific type if you know the shape
  createdAt: string;
  updatedAt: string;
}
