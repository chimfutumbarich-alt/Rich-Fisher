
import React, { useState } from 'react';
import { Property, Ad } from '../types';
import { ADMIN_CONTACT } from '../constants';

interface AdminPanelProps {
  properties: Property[];
  onDeleteProperty: (id: string) => void;
  ads: Ad[];
  onToggleAd: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ properties, onDeleteProperty, ads, onToggleAd }) => {
  const [activeView, setActiveView] = useState<'listings' | 'ads' | 'updates' | 'treasury'>('listings');

  return (
    <div className="bg-slate-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-amber-500/20 pb-6 gap-4">
          <h1 className="text-4xl font-display font-bold text-white">
            Wealth <span className="text-amber-500">Admin Portal</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'listings', label: 'All Listings', icon: 'fa-home' },
              { id: 'ads', label: 'Advertising', icon: 'fa-ad' },
              { id: 'treasury', label: 'Treasury', icon: 'fa-landmark' },
              { id: 'updates', label: 'Infrastructure', icon: 'fa-server' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeView === tab.id 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white bg-slate-800'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeView === 'listings' && (
          <div className="bg-slate-800 rounded-3xl overflow-hidden border border-amber-500/10 shadow-2xl">
            <div className="p-6 bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Live Property Inventory</h2>
              <span className="text-sm bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full font-bold">Total: {properties.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Property Identity</th>
                    <th className="px-6 py-4">Owner/Agent</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Valuation</th>
                    <th className="px-6 py-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img src={p.imageUrls[0]} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                          <div>
                            <p className="text-sm font-bold text-white">{p.title}</p>
                            <p className="text-xs text-slate-500"><i className="fas fa-map-marker-alt mr-1"></i> {p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300 font-semibold">{p.sellerName}</p>
                        <p className="text-xs text-slate-500">{p.sellerEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-slate-950 px-2 py-1 rounded-full border border-amber-500/40 text-amber-500 font-bold uppercase tracking-tighter">
                          {p.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-amber-500">ZMW {p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onDeleteProperty(p.id)}
                          className="text-red-500 hover:text-white hover:bg-red-500 bg-red-500/10 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          <i className="fas fa-trash-alt mr-2"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'ads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map(ad => (
              <div key={ad.id} className="bg-slate-800 p-6 rounded-3xl border border-amber-500/10 shadow-xl group">
                <div className="relative mb-6 rounded-2xl overflow-hidden h-48">
                  <img src={ad.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ad.isActive ? 'bg-green-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{ad.title}</h3>
                <p className="text-xs text-slate-400 mb-6 font-medium">Verified Ad Revenue Merchant: <span className="text-amber-500">{ad.merchantAccount}</span></p>
                <button 
                  onClick={() => onToggleAd(ad.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${ad.isActive ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-slate-950'}`}
                >
                  {ad.isActive ? 'Deactivate Ad' : 'Authorize Ad'}
                </button>
              </div>
            ))}
            <div className="bg-slate-800/50 p-6 rounded-3xl border-2 border-dashed border-amber-500/20 flex flex-col items-center justify-center text-slate-600 hover:text-amber-500 hover:border-amber-500/50 cursor-pointer transition-all h-full min-h-[300px]">
              <i className="fas fa-plus-circle text-5xl mb-4"></i>
              <p className="font-black uppercase tracking-widest">New Paid Placement</p>
            </div>
          </div>
        )}

        {activeView === 'treasury' && (
          <div className="bg-slate-800 p-10 rounded-3xl border border-amber-500/20 shadow-2xl max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-amber-500/20">
              <i className="fas fa-university"></i>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Corporate Treasury Account</h2>
            <p className="text-slate-400 mb-8 text-sm">All payments for advertisements and premium listings must be settled into this official company account.</p>
            
            <div className="space-y-4 text-left">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Bank Name</span>
                <span className="text-lg font-bold text-white">{ADMIN_CONTACT.adminBankName}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Account Number</span>
                <span className="text-lg font-mono font-bold text-amber-500">{ADMIN_CONTACT.adminBankAccount}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Beneficiary</span>
                <span className="text-lg font-bold text-white">{ADMIN_CONTACT.companyName}</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'updates' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-slate-800 p-8 rounded-3xl border border-amber-500/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center"><i className="fas fa-terminal mr-3 text-amber-500"></i> Infrastructure Control</h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><i className="fas fa-broom"></i></div>
                    <div>
                      <p className="text-sm font-bold text-white">System Cache</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black">Performance Management</p>
                    </div>
                  </div>
                  <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400">Purge</button>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center"><i className="fas fa-shield-alt"></i></div>
                    <div>
                      <p className="text-sm font-bold text-white">Audit Logs</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black">Security Protocol</p>
                    </div>
                  </div>
                  <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400">Review</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
