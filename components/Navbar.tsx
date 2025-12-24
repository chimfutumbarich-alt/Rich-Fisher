
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onLogout, 
  onOpenLogin, 
  onOpenRegister,
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    { id: 'all', label: 'All Listings' },
    { id: 'houses_sale', label: 'Houses (Sale)' },
    { id: 'land_sale', label: 'Land' },
    { id: 'warehouse_sale', label: 'Warehouses' },
    { id: 'apartment_rent', label: 'Apartments (Rent)' },
    { id: 'houses_rent', label: 'Houses (Rent)' },
  ];

  return (
    <nav className="bg-slate-900 border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('all')}>
            <span className="text-3xl font-display font-bold text-amber-500 tracking-tighter">WEALTH</span>
            <span className="text-3xl font-display font-bold text-white tracking-tighter ml-2">ESTATE</span>
          </div>

          <div className="hidden md:flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-300 hover:text-amber-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 hidden sm:inline">Hello, <span className="text-amber-500 font-semibold">{user.name}</span></span>
                <button 
                  onClick={onLogout}
                  className="bg-slate-800 border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onOpenLogin}
                  className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={onOpenRegister}
                  className="bg-amber-500 text-slate-900 hover:bg-amber-400 px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all"
                >
                  Become a Seller/Agent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
