
import React, { useState } from 'react';
import { UserRole, PaymentMethod } from '../types';

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (userData: any) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.SELLER,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    bankAccount: '',
    verificationCode: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate generation of code after registration
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setStep(2);
  };

  const handleVerify = () => {
    if (formData.verificationCode === generatedCode) {
      onRegister(formData);
    } else {
      alert("Invalid verification code!");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            {step === 1 ? 'Become a Partner' : 'Verify Account'}
          </h2>
          <button onClick={onClose} className="text-slate-900 hover:scale-110"><i className="fas fa-times"></i></button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.SELLER}>Private Seller</option>
                  <option value={UserRole.AGENT}>Professional Agent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payment Method (For Commission/Ads)</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})}
                >
                  <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                  <option value={PaymentMethod.CREDIT_CARD}>Credit Card</option>
                  <option value={PaymentMethod.PAYPAL}>PayPal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bank Account Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter account for payments"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  value={formData.bankAccount}
                  onChange={e => setFormData({...formData, bankAccount: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-amber-400 shadow-xl transition-all"
              >
                Complete Registration
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                <p className="text-sm text-amber-500 font-bold mb-2">Simulated SMS/Email Sent!</p>
                <p className="text-2xl font-display font-bold text-white tracking-widest">{generatedCode}</p>
                <p className="text-xs text-slate-400 mt-2">Normally this would be sent to your phone/email.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Enter Verification Code</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-amber-500 focus:outline-none focus:border-amber-500"
                  maxLength={6}
                  value={formData.verificationCode}
                  onChange={e => setFormData({...formData, verificationCode: e.target.value})}
                />
              </div>
              <button 
                onClick={handleVerify}
                className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-amber-400 shadow-xl transition-all"
              >
                Verify & Start Selling
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
