
import { Property, PropertyType, UserRole, Ad } from './types';

export const ADMIN_CONTACT = {
  companyName: "Wealth Estate Global",
  address: "123 Opulence Avenue, Suite 500, Gold Coast",
  phone: "+1 800-WEALTH-01",
  email: "admin@wealthestate.com",
  whatsApp: "+1234567890"
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Sunset Villa',
    description: 'A luxurious villa with breathtaking ocean views and a private pool.',
    price: 1250000,
    location: 'Malibu, CA',
    type: PropertyType.HOUSE_SALE,
    imageUrl: 'https://picsum.photos/seed/villa1/800/600',
    sellerId: 's1',
    sellerName: 'John Agent',
    sellerPhone: '555-0101',
    sellerEmail: 'john@agents.com',
    sellerWhatsApp: '5550101',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Fertile Agricultural Land',
    description: '50 acres of prime farming land with water rights.',
    price: 450000,
    location: 'Iowa, USA',
    type: PropertyType.LAND_SALE,
    imageUrl: 'https://picsum.photos/seed/land1/800/600',
    sellerId: 's2',
    sellerName: 'Sarah Smith',
    sellerPhone: '555-0102',
    sellerEmail: 'sarah@owner.com',
    sellerWhatsApp: '5550102',
    createdAt: Date.now(),
  },
  {
    id: '3',
    title: 'Industrial Logistics Hub',
    description: 'High-ceiling warehouse with 10 loading docks.',
    price: 3500000,
    location: 'Chicago, IL',
    type: PropertyType.WAREHOUSE_SALE,
    imageUrl: 'https://picsum.photos/seed/warehouse1/800/600',
    sellerId: 's1',
    sellerName: 'John Agent',
    sellerPhone: '555-0101',
    sellerEmail: 'john@agents.com',
    sellerWhatsApp: '5550101',
    createdAt: Date.now(),
  },
  {
    id: '4',
    title: 'Luxury Penthouse Loft',
    description: 'Chic urban living in the heart of the city.',
    price: 4500,
    location: 'New York, NY',
    type: PropertyType.APARTMENT_RENT,
    imageUrl: 'https://picsum.photos/seed/apt1/800/600',
    sellerId: 's3',
    sellerName: 'David Rent',
    sellerPhone: '555-0103',
    sellerEmail: 'david@rentals.com',
    sellerWhatsApp: '5550103',
    createdAt: Date.now(),
  }
];

export const MOCK_ADS: Ad[] = [
  {
    id: 'ad1',
    title: 'Premium Home Insurance',
    imageUrl: 'https://picsum.photos/seed/ad1/400/200',
    link: '#',
    isActive: true
  }
];
