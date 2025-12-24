
import React, { useState } from 'react';
import { Property, Ad } from '../types';

interface AdminPanelProps {
  properties: Property[];
  onDeleteProperty: (id: string) => void;
  ads: Ad[];
  onToggleAd: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ properties, onDeleteProperty, ads, onToggleAd }) => {
  const [activeView, setActiveView] = useState<'listings' | 'ads' | 'updates'>('listings');

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-amber-500/30 pb-4">
          <h1 className="text-3xl font-display font-bold text-white">Admin <span className="text-amber-500">Command Center</span></h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveView('listings')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'listings' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Listings
            </button>
            <button 
              onClick={() => setActiveView('ads')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'ads' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Ad Management
            </button>
            <button 
              onClick={() => setActiveView('updates')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'updates' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Site Updates
            </button>
          </div>
        </div>

        {activeView === 'listings' && (
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {properties.map(p => (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold text-white">{p.title}</p>
                          <p className="text-xs text-slate-400">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{p.sellerName}</p>
                      <p className="text-xs text-slate-500">{p.sellerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-900 px-2 py-1 rounded-full border border-amber-500/30 text-amber-500">{p.type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-500">${p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteProperty(p.id)}
                        className="text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-lg"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === 'ads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ads.map(ad => (
              <div key={ad.id} className="bg-slate-800 p-6 rounded-2xl border border-amber-500/20 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={ad.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{ad.title}</h3>
                    <p className="text-xs text-slate-400">Attached to Merchant Account</p>
                  </div>
                </div>
                <button 
                  onClick={() => onToggleAd(ad.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${ad.isActive ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                >
                  {ad.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
            <div className="bg-slate-800 p-6 rounded-2xl border border-dashed border-amber-500/30 flex flex-col items-center justify-center text-slate-500 hover:text-amber-500 cursor-pointer transition-colors">
              <i className="fas fa-plus-circle text-4xl mb-2"></i>
              <p className="font-bold">New Paid Ad</p>
            </div>
          </div>
        )}

        {activeView === 'updates' && (
          <div className="bg-slate-800 p-8 rounded-2xl border border-amber-500/20 max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">Website Infrastructure Updates</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-900 rounded-xl border border-slate-700">
                <i className="fas fa-sync text-amber-500"></i>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">Cache Flushing</p>
                  <p className="text-xs text-slate-500">Clear global asset cache</p>
                </div>
                <button className="bg-amber-500 text-slate-900 px-3 py-1 rounded text-xs font-bold">Run</button>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-900 rounded-xl border border-slate-700 opacity-50">
                <i className="fas fa-database text-amber-500"></i>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">Database Optimization</p>
                  <p className="text-xs text-slate-500">Auto-vacuuming scheduled</p>
                </div>
                <span className="text-xs font-bold text-amber-500">Auto</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
