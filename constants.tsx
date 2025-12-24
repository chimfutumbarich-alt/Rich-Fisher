
import { Property, PropertyType, Ad } from './types';

export const ADMIN_CONTACT = {
  companyName: "Wealth Estate Limited",
  address: "Gold Tower, 456 Prosperity Road, Lusaka, Zambia",
  phone: "+260 971 234 567",
  email: "admin@wealthestate.com",
  whatsApp: "+260971234567",
  adminBankAccount: "STB-WE-9988776655-ZMW", // Only Admin bank account displayed
  adminBankName: "Standard Trust Bank"
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Emerald Park Mansion',
    description: 'A 6-bedroom masterpiece with marble flooring and a private tennis court.',
    price: 850000,
    location: 'Leopards Hill, Lusaka',
    type: PropertyType.HOUSE_SALE,
    imageUrls: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'],
    sellerId: 's1',
    sellerName: 'Kelvin Mwamba',
    sellerPhone: '+260965000111',
    sellerEmail: 'kelvin@agents.com',
    sellerWhatsApp: '260965000111',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Prime 10-Acre Industrial Land',
    description: 'Flat, secure land perfect for multi-purpose development near the main highway.',
    price: 120000,
    location: 'Chilanga, Lusaka',
    type: PropertyType.LAND_SALE,
    imageUrls: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'],
    sellerId: 's2',
    sellerName: 'Sarah Phiri',
    sellerPhone: '+260955888999',
    sellerEmail: 'sarah@owner.com',
    sellerWhatsApp: '260955888999',
    createdAt: Date.now(),
  }
];

export const MOCK_ADS: Ad[] = [
  {
    id: 'ad1',
    title: 'Home Furnishing Expo 2025',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
    link: '#',
    isActive: true,
    merchantAccount: 'ACC-9900'
  }
];
