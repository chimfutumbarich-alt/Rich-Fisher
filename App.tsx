
import React, { useState, useMemo } from 'react';
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

  const [newProperty, setNewProperty] = useState({
    title: '',
    type: PropertyType.HOUSE_SALE,
    location: '',
    price: 0,
    features: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

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
    const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
    if (email === 'admin@wealth.com') {
      setUser({
        id: 'admin',
        name: 'Super Admin',
        email: 'admin@wealth.com',
        phone: '000',
        role: UserRole.ADMIN,
        isVerified: true,
        propertyCount: 0
      });
      setIsAdminMode(true);
    } else {
      setUser({
        id: 'user1',
        name: 'Demo User',
        email: email,
        phone: '555-0000',
        role: UserRole.SELLER,
        isVerified: true,
        propertyCount: 1
      });
    }
    setShowLogin(false);
  };

  const handleUploadProperty = async () => {
    if (user && user.propertyCount >= 5) {
      alert("Maximum 5 properties allowed per seller.");
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
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
      sellerId: user?.id || 'anon',
      sellerName: user?.name || 'Anonymous',
      sellerPhone: user?.phone || 'N/A',
      sellerEmail: user?.email || 'N/A',
      sellerWhatsApp: user?.phone.replace(/\D/g,'') || '123456',
      createdAt: Date.now()
    };

    setProperties([prop, ...properties]);
    if (user) setUser({ ...user, propertyCount: user.propertyCount + 1 });
    setIsGenerating(false);
    setShowUpload(false);
  };

  const deleteProperty = (id: string) => {
    if (window.confirm("Are you sure you want to remove this property?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  if (isAdminMode && user?.role === UserRole.ADMIN) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <div className="flex bg-slate-800 p-4 justify-between items-center border-b border-amber-500">
          <span className="font-bold text-amber-500">ADMIN MODE ACTIVE</span>
          <button onClick={() => setIsAdminMode(false)} className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold">Exit Admin View</button>
        </div>
        <AdminPanel 
          properties={properties} 
          onDeleteProperty={deleteProperty}
          ads={ads}
          onToggleAd={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        user={user} 
        onLogout={() => { setUser(null); setIsAdminMode(false); }} 
        onOpenLogin={() => setShowLogin(true)}
        onOpenRegister={() => setShowRegister(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero Section */}
      <header className="relative py-24 px-4 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/bg/1920/1080" alt="background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Secure Your <span className="text-amber-500">Legacy</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Exclusive access to the world's most prestigious residences, prime lands, and strategic industrial warehouses.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setActiveTab('houses_sale')}
              className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 shadow-2xl transition-all"
            >
              Explore Properties
            </button>
            {user && (
              <button 
                onClick={() => setShowUpload(true)}
                className="bg-slate-800 border border-amber-500 text-amber-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all"
              >
                List Your Property
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Ad Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-md">
            <h3 className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-4">Sponsored</h3>
            {ads.map(ad => (
              <div key={ad.id} className="group cursor-pointer">
                <img src={ad.imageUrl} className="w-full h-40 object-cover rounded-xl mb-3 border border-amber-500/10 group-hover:border-amber-500 transition-all" />
                <h4 className="text-white font-semibold text-sm">{ad.title}</h4>
                <p className="text-xs text-slate-500 mt-1">Authorized Provider</p>
              </div>
            ))}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-xs text-slate-400">Want to see your business here?</p>
              <button className="text-amber-500 text-xs font-bold hover:underline mt-1">Apply for Ad Space</button>
            </div>
          </div>

          <div className="bg-amber-500 p-6 rounded-2xl text-slate-900">
            <h3 className="font-bold text-lg mb-2">Concierge Support</h3>
            <p className="text-sm font-medium mb-4 opacity-80">Our specialists are available 24/7 for luxury portfolio management.</p>
            <div className="space-y-2">
              <a href={`mailto:${ADMIN_CONTACT.email}`} className="flex items-center space-x-2 text-sm font-bold">
                <i className="fas fa-envelope"></i> <span>{ADMIN_CONTACT.email}</span>
              </a>
              <a href={`https://wa.me/${ADMIN_CONTACT.whatsApp}`} className="flex items-center space-x-2 text-sm font-bold">
                <i className="fab fa-whatsapp"></i> <span>Message us on WhatsApp</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Property Grid */}
        <section className="lg:col-span-3">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-white">Featured <span className="text-amber-500">Collections</span></h2>
              <p className="text-slate-400 mt-2">Showing {filteredProperties.length} elite properties</p>
            </div>
            <div className="text-sm text-slate-500">
              Sort by: <span className="text-white font-bold cursor-pointer hover:text-amber-500">Newest First</span>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <i className="fas fa-search text-4xl text-slate-700 mb-4"></i>
              <p className="text-slate-400">No properties found in this category.</p>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={handleRegister} />}
      
      {showLogin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-sm p-8 shadow-2xl">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Welcome <span className="text-amber-500">Back</span></h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email Address" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
              <input type="password" placeholder="Password" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
              <button type="submit" className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-amber-400 shadow-xl transition-all">Sign In</button>
            </form>
            <p className="text-center text-slate-500 text-xs mt-6">Use admin@wealth.com for admin panel</p>
            <button onClick={() => setShowLogin(false)} className="w-full mt-4 text-slate-400 text-sm hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-lg p-8 shadow-2xl my-8">
            <h2 className="text-2xl font-display font-bold text-white mb-6">List New <span className="text-amber-500">Property</span></h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Listing Title</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  value={newProperty.title}
                  onChange={e => setNewProperty({...newProperty, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    value={newProperty.type}
                    onChange={e => setNewProperty({...newProperty, type: e.target.value as PropertyType})}
                  >
                    {Object.values(PropertyType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    value={newProperty.price}
                    onChange={e => setNewProperty({...newProperty, price: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  value={newProperty.location}
                  onChange={e => setNewProperty({...newProperty, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Key Features (for AI Description)</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white h-24"
                  placeholder="e.g. 5 bedrooms, marble floors, helipad, smart home tech"
                  value={newProperty.features}
                  onChange={e => setNewProperty({...newProperty, features: e.target.value})}
                />
              </div>
              <button 
                onClick={handleUploadProperty}
                disabled={isGenerating}
                className={`w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-amber-400 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? 'AI Crafting Description...' : 'Publish Listing'}
              </button>
              <button onClick={() => setShowUpload(false)} className="w-full text-slate-400 text-sm hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Company Info Footer */}
      <footer className="bg-slate-900 border-t border-amber-500/30 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-display font-bold text-white mb-4">WEALTH ESTATE</h2>
            <p className="text-slate-400 max-w-sm mb-6">The definitive standard for luxury real estate services globally. Trust in our legacy, invest in your future.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-500 hover:text-white text-xl transition-colors"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-amber-500 hover:text-white text-xl transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-amber-500 hover:text-white text-xl transition-colors"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-amber-500 hover:text-white text-xl transition-colors"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Corporate Office</h3>
            <ul className="text-slate-400 text-sm space-y-3">
              <li className="flex items-start space-x-2">
                <i className="fas fa-map-marker-alt text-amber-500 mt-1"></i>
                <span>{ADMIN_CONTACT.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-phone text-amber-500"></i>
                <span>{ADMIN_CONTACT.phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope text-amber-500"></i>
                <span>{ADMIN_CONTACT.email}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Direct Inquiry</h3>
            <a 
              href={`https://wa.me/${ADMIN_CONTACT.whatsApp}`} 
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-xl"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span>WhatsApp Admin</span>
            </a>
          </div>
        </div>
        <div className="text-center border-t border-slate-800 pt-8 mt-8">
          <p className="text-xs text-slate-500">© 2025 {ADMIN_CONTACT.companyName}. All Rights Reserved. Luxury properties subject to prior sale.</p>
        </div>
      </footer>

      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-amber-500 text-slate-900 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
          <i className="fas fa-comment-dots text-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
