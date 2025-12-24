
import React, { useState, useMemo, useRef } from 'react';
import { Property, User, UserRole, PropertyType, Ad } from './types';
import { MOCK_PROPERTIES, MOCK_ADS, ADMIN_CONTACT } from './constants';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import RegisterModal from './components/RegisterModal';
import AdminPanel from './components/AdminPanel';
import { generatePropertyDescription } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [ads] = useState<Ad[]>(MOCK_ADS);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Admin login details as requested: admin@wealth.com
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProperty, setNewProperty] = useState({
    title: '',
    type: PropertyType.HOUSE_SALE,
    location: '',
    price: 0,
    features: '',
    imageDatas: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const MAX_PHOTOS = 15;

  const filteredProperties = useMemo(() => {
    if (activeTab === 'all') return properties;
    const tabMap: Record<string, PropertyType> = {
      'houses_sale': PropertyType.HOUSE_SALE,
      'land_sale': PropertyType.LAND_SALE,
      'warehouse_sale': PropertyType.WAREHOUSE_SALE,
      'apartment_rent': PropertyType.APARTMENT_RENT,
      'houses_rent': PropertyType.HOUSE_RENT
    };
    return properties.filter(p => p.type === tabMap[activeTab]);
  }, [activeTab, properties]);

  const handleRegister = (data: any) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      paymentMethod: data.paymentMethod,
      bankAccount: data.bankAccount,
      isVerified: true,
      propertyCount: 0
    };
    setUser(newUser);
    setShowRegister(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email === 'admin@wealth.com' && loginData.password === 'admin123') {
      const adminUser: User = {
        id: 'admin',
        name: 'System Admin',
        email: 'admin@wealth.com',
        phone: ADMIN_CONTACT.phone,
        role: UserRole.ADMIN,
        isVerified: true,
        propertyCount: 0
      };
      setUser(adminUser);
      setIsAdminMode(true);
      setShowLogin(false);
    } else {
      // Demo login for standard users
      setUser({
        id: 'user1',
        name: 'Elite Partner',
        email: loginData.email,
        phone: '+260111222333',
        role: UserRole.SELLER,
        isVerified: true,
        propertyCount: 1
      });
      setShowLogin(false);
    }
  };

  // Fixed TypeScript error by explicitly casting Array.from result to File[] to satisfy FileReader requirements
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const remainingSlots = MAX_PHOTOS - newProperty.imageDatas.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      alert(`Notice: Maximum limit of ${MAX_PHOTOS} photos reached. Some files were ignored.`);
    }

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProperty(prev => ({ 
          ...prev, 
          imageDatas: [...prev.imageDatas, reader.result as string] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setNewProperty(prev => ({
      ...prev,
      imageDatas: prev.imageDatas.filter((_, i) => i !== index)
    }));
  };

  const handleUploadProperty = async () => {
    // Enforcement of maximum 5 properties limit
    if (user && user.role !== UserRole.ADMIN && user.propertyCount >= 5) {
      alert("Registration Restriction: You have reached the maximum of 5 property listings. Contact Admin for premium expansion.");
      return;
    }

    if (newProperty.imageDatas.length === 0) {
      alert("Please upload at least one image for the property.");
      return;
    }

    setIsGenerating(true);
    const description = await generatePropertyDescription(newProperty.title, newProperty.type, newProperty.features);
    
    const prop: Property = {
      id: Date.now().toString(),
      title: newProperty.title,
      description,
      price: newProperty.price,
      location: newProperty.location,
      type: newProperty.type,
      imageUrls: newProperty.imageDatas,
      sellerId: user?.id || 'anon',
      sellerName: user?.name || 'Private Client',
      sellerPhone: user?.phone || 'N/A',
      sellerEmail: user?.email || 'N/A',
      sellerWhatsApp: user?.phone.replace(/\D/g,'') || '260971234567',
      createdAt: Date.now()
    };

    setProperties([prop, ...properties]);
    if (user) setUser({ ...user, propertyCount: user.propertyCount + 1 });
    setIsGenerating(false);
    setShowUpload(false);
    setNewProperty({
      title: '',
      type: PropertyType.HOUSE_SALE,
      location: '',
      price: 0,
      features: '',
      imageDatas: []
    });
  };

  const deleteProperty = (id: string) => {
    if (window.confirm("CRITICAL: Permanent deletion of this asset registry. Proceed?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const UploadModalContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Listing Title</label>
          <input 
            type="text" 
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            value={newProperty.title}
            onChange={e => setNewProperty({...newProperty, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Asset Classification</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            value={newProperty.type}
            onChange={e => setNewProperty({...newProperty, type: e.target.value as PropertyType})}
          >
            {Object.values(PropertyType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Price (ZMW)</label>
          <input 
            type="number" 
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none font-bold"
            value={newProperty.price}
            onChange={e => setNewProperty({...newProperty, price: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Geographical Location</label>
          <input 
            type="text" 
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            value={newProperty.location}
            onChange={e => setNewProperty({...newProperty, location: e.target.value})}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Upload Asset Imagery (Max {MAX_PHOTOS})</label>
          <span className="text-[10px] font-bold text-amber-500">{newProperty.imageDatas.length} / {MAX_PHOTOS}</span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {newProperty.imageDatas.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-700">
              <img src={img} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          {newProperty.imageDatas.length < MAX_PHOTOS && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/80 transition-all"
            >
              <i className="fas fa-plus text-slate-600"></i>
            </div>
          )}
        </div>
        
        {newProperty.imageDatas.length === 0 && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 bg-slate-800 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/80 transition-all"
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-600 mb-3"></i>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Select Property Photos</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Exclusive Features (AI Intellect Input)</label>
        <textarea 
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white h-32 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
          placeholder="e.g. Waterfront access, smart security, solar farm, 50-car parking..."
          value={newProperty.features}
          onChange={e => setNewProperty({...newProperty, features: e.target.value})}
        />
      </div>
      
      <div className="pt-4">
        <button 
          onClick={handleUploadProperty}
          disabled={isGenerating}
          className={`w-full bg-amber-500 text-slate-950 font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center space-x-3 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGenerating ? (
            <>
              <i className="fas fa-circle-notch animate-spin"></i>
              <span>AI Crafting Luxury Narrative...</span>
            </>
          ) : (
            <>
              <i className="fas fa-upload"></i>
              <span>Authorize & Publish Listing</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isAdminMode && user?.role === UserRole.ADMIN) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <div className="flex bg-slate-950 p-4 justify-between items-center border-b border-amber-600/50 sticky top-0 z-[100]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="font-black text-amber-500 tracking-widest text-xs">ADMINISTRATIVE SESSION ACTIVE</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowUpload(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-green-500 transition-all uppercase"
            >
              Add Property
            </button>
            <button 
              onClick={() => setIsAdminMode(false)} 
              className="bg-amber-500 text-slate-950 px-6 py-2 rounded-xl font-black text-xs hover:bg-amber-400 transition-all uppercase"
            >
              Exit Master View
            </button>
          </div>
        </div>
        <AdminPanel 
          properties={properties} 
          onDeleteProperty={deleteProperty}
          ads={ads}
          onToggleAd={() => {}}
        />
        {showUpload && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-amber-500/30 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl my-10 relative">
              <button onClick={() => setShowUpload(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><i className="fas fa-times text-2xl"></i></button>
              <h2 className="text-4xl font-display font-bold text-white mb-2">Publish <span className="text-amber-500">Asset</span></h2>
              <p className="text-slate-500 font-medium mb-10">Administrative Upload Mode.</p>
              {UploadModalContent}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-950 selection:bg-amber-500 selection:text-slate-950">
      <Navbar 
        user={user} 
        onLogout={() => { setUser(null); setIsAdminMode(false); }} 
        onOpenLogin={() => setShowLogin(true)}
        onOpenRegister={() => setShowRegister(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover scale-105 opacity-40 blur-[2px]" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full mb-8">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-[0.3em]">Excellence Reimagined</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-8 leading-tight">
            Wealth <span className="text-amber-500">Estate</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            The definitive platform for high-value asset acquisitions and luxury living solutions across Zambia and beyond.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={() => setActiveTab('houses_sale')}
              className="group relative bg-amber-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-all overflow-hidden"
            >
              <span className="relative z-10">Explore Collections</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>
            {user && (
              <button 
                onClick={() => setShowUpload(true)}
                className="bg-transparent border-2 border-amber-500/50 text-amber-500 px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                List Your Asset
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-amber-500/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.3em]">Featured Partners</h3>
              <div className="h-px bg-amber-500/20 flex-1 ml-4"></div>
            </div>
            
            <div className="space-y-10">
              {ads.filter(a => a.isActive).map(ad => (
                <div key={ad.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl mb-4 border border-slate-800 group-hover:border-amber-500/50 transition-all">
                    <img src={ad.imageUrl} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <h4 className="text-white font-bold text-base leading-tight group-hover:text-amber-500 transition-colors">{ad.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Sponsored Placement</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800">
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Secure your business presence on our elite platform.</p>
              <button 
                onClick={() => window.open(`https://wa.me/${ADMIN_CONTACT.whatsApp}`, '_blank')}
                className="text-amber-500 text-xs font-bold hover:underline mt-4 flex items-center"
              >
                Inquire for Advertising <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-400 p-8 rounded-[2.5rem] text-slate-950 shadow-2xl shadow-amber-500/10">
            <div className="w-12 h-12 bg-slate-950 text-amber-500 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-xl">
              <i className="fas fa-headset"></i>
            </div>
            <h3 className="font-black text-xl mb-3 tracking-tighter">Concierge Services</h3>
            <p className="text-sm font-semibold mb-8 leading-relaxed opacity-80">Professional management for high-net-worth real estate portfolios. Speak with us today.</p>
            <div className="space-y-4">
              <a href={`mailto:${ADMIN_CONTACT.email}`} className="flex items-center space-x-3 text-sm font-black hover:translate-x-1 transition-transform bg-slate-950/10 p-3 rounded-xl border border-slate-950/10">
                <i className="fas fa-envelope"></i> <span>Send Email</span>
              </a>
              <a href={`https://wa.me/${ADMIN_CONTACT.whatsApp}`} className="flex items-center space-x-3 text-sm font-black hover:translate-x-1 transition-transform bg-slate-950/10 p-3 rounded-xl border border-slate-950/10">
                <i className="fab fa-whatsapp"></i> <span>WhatsApp Agent</span>
              </a>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-amber-500/5 mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Registry</span>
              </div>
              <h2 className="text-4xl font-display font-bold text-white tracking-tight">Curated <span className="text-amber-500">Inventory</span></h2>
              <p className="text-slate-400 mt-2 font-medium">Presenting {filteredProperties.length} elite opportunities</p>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-800/50">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 text-3xl">
                <i className="fas fa-search"></i>
              </div>
              <p className="text-slate-400 font-bold text-xl">The registry is empty for this category.</p>
              <button onClick={() => setActiveTab('all')} className="mt-6 text-amber-500 font-bold hover:underline">View All Active Listings</button>
            </div>
          )}
        </section>
      </main>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={handleRegister} />}
      
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-[3rem] w-full max-md p-10 shadow-[0_0_100px_rgba(245,158,11,0.1)]">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-display font-bold text-white mb-2">Access <span className="text-amber-500">Wealth</span></h2>
              <p className="text-slate-500 font-medium">Login to manage your luxury portfolio</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Identity (Email)</label>
                <input 
                  type="email" 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                  value={loginData.email}
                  onChange={e => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Passphrase</label>
                <input 
                  type="password" 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-5 rounded-2xl hover:bg-amber-400 shadow-xl transition-all mt-4 transform hover:-translate-y-1">Initialize Session</button>
            </form>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center">
              <p className="text-slate-400 text-xs mt-2 italic">Use admin@wealth.com / admin123 for master access</p>
              <button onClick={() => setShowLogin(false)} className="mt-6 text-slate-600 text-sm hover:text-white transition-colors">Abort Login</button>
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/30 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl my-10 relative">
            <button onClick={() => setShowUpload(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><i className="fas fa-times text-2xl"></i></button>
            <h2 className="text-4xl font-display font-bold text-white mb-2">Publish <span className="text-amber-500">Asset</span></h2>
            <p className="text-slate-500 font-medium mb-10">You are listing property {user?.propertyCount ? user.propertyCount + 1 : 1} of 5 permitted.</p>
            {UploadModalContent}
          </div>
        </div>
      )}

      <footer className="bg-slate-900 border-t border-amber-600/20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-display font-bold text-white mb-6">WEALTH <span className="text-amber-500">ESTATE</span></h2>
            <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed font-medium">Providing the standard for excellence in real estate transactions. Trust in our legacy, invest in your future.</p>
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-8 text-amber-500">Corporate HQ</h3>
            <ul className="text-slate-400 text-sm space-y-6 font-semibold">
              <li className="flex items-start space-x-4">
                <i className="fas fa-map-marker-alt text-amber-500 mt-1"></i>
                <span className="leading-relaxed">{ADMIN_CONTACT.address}</span>
              </li>
              <li className="flex items-center space-x-4">
                <i className="fas fa-phone-alt text-amber-500"></i>
                <span>{ADMIN_CONTACT.phone}</span>
              </li>
              <li className="flex items-center space-x-4">
                <i className="fas fa-envelope text-amber-500"></i>
                <span>{ADMIN_CONTACT.email}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-8 text-amber-500">Inquiry</h3>
            <a 
              href={`https://wa.me/${ADMIN_CONTACT.whatsApp}`} 
              className="group inline-flex items-center space-x-3 bg-green-600 hover:bg-green-500 text-slate-950 px-6 py-4 rounded-2xl font-black transition-all shadow-2xl"
            >
              <i className="fab fa-whatsapp text-2xl"></i>
              <span>WhatsApp Admin</span>
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center border-t border-slate-800 pt-10">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            © 2025 {ADMIN_CONTACT.companyName}. Licensed Luxury Brokerage. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
