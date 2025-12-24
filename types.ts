
export enum PropertyType {
  HOUSE_SALE = 'HOUSE_SALE',
  LAND_SALE = 'LAND_SALE',
  WAREHOUSE_SALE = 'WAREHOUSE_SALE',
  APARTMENT_RENT = 'APARTMENT_RENT',
  HOUSE_RENT = 'HOUSE_RENT'
}

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  MOBILE_MONEY = 'MOBILE_MONEY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  paymentMethod?: PaymentMethod;
  bankAccount?: string;
  isVerified: boolean;
  propertyCount: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: PropertyType;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerWhatsApp: string;
  createdAt: number;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}
