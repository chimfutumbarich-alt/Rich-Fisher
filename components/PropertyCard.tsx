
import React from 'react';
import { Property, UserRole } from '../types';

interface PropertyCardProps {
  property: Property;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isAdmin, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isRent = property.type.includes('RENT');

  return (
    <div className="bg-slate-800 rounded-2xl border border-amber-500/10 overflow-hidden hover:border-amber-500/50 transition-all group shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-900/80 backdrop-blur-md text-amber-500 border border-amber-500/30`}>
            {property.type.replace('_', ' ')}
          </span>
        </div>
        {isAdmin && (
          <button 
            onClick={() => onDelete?.(property.id)}
            className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{property.title}</h3>
          <p className="text-xl font-bold text-amber-500">
            {formatPrice(property.price)}
            {isRent && <span className="text-sm text-slate-400 font-normal">/mo</span>}
          </p>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center text-slate-300 text-xs mb-6 space-x-4">
          <span className="flex items-center">
            <i className="fas fa-map-marker-alt text-amber-500 mr-1"></i> {property.location}
          </span>
        </div>

        <div className="border-t border-slate-700 pt-4 mt-auto">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Contact Seller</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-500 font-bold">
                {property.sellerName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-200">{property.sellerName}</span>
            </div>
            <div className="flex space-x-2">
              <a 
                href={`mailto:${property.sellerEmail}`}
                className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition-all"
                title="Email Seller"
              >
                <i className="fas fa-envelope"></i>
              </a>
              <a 
                href={`https://wa.me/${property.sellerWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-green-400 hover:bg-green-400 hover:text-white transition-all"
                title="WhatsApp Seller"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
