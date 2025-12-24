
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
    // Verification code is only generated/sent AFTER registration form is filled
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setStep(2);
  };

  const handleVerify = () => {
    if (formData.verificationCode === generatedCode) {
      onRegister(formData);
    } else {
      alert("Invalid verification code! Check your mobile/email.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 px-6 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">
            {step === 1 ? 'Partner Registration' : 'Account Verification'}
          </h2>
          <button onClick={onClose} className="text-slate-950 hover:scale-110 transition-transform"><i className="fas fa-times"></i></button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel" required
                    placeholder="+260..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Registration Role</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.SELLER}>Private Seller</option>
                    <option value={UserRole.AGENT}>Certified Agent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payment Method</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData.paymentMethod}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})}
                  >
                    <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                    <option value={PaymentMethod.MTN_MONEY}>MTN Mobile Money</option>
                    <option value={PaymentMethod.AIRTEL_MONEY}>Airtel Mobile Money</option>
                    <option value={PaymentMethod.ZAMTEL_MONEY}>Zamtel Mobile Money</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payout Account (Phone or Bank No.)</label>
                <input 
                  type="text" required
                  placeholder="Enter account for receiving payments"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.bankAccount}
                  onChange={e => setFormData({...formData, bankAccount: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl hover:bg-amber-400 shadow-xl transition-all transform hover:-translate-y-1"
              >
                Register & Request Verification Code
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/20">
                <p className="text-sm text-amber-500 font-bold mb-2 uppercase tracking-widest">Verification Code Sent</p>
                <p className="text-4xl font-display font-bold text-white tracking-[0.2em]">{generatedCode}</p>
                <p className="text-xs text-slate-500 mt-4 italic">Verification code sent to {formData.email} and {formData.phone}</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Enter 6-Digit Code</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-amber-500 focus:ring-2 focus:ring-amber-500 outline-none"
                  maxLength={6}
                  value={formData.verificationCode}
                  onChange={e => setFormData({...formData, verificationCode: e.target.value})}
                />
              </div>

              <button 
                onClick={handleVerify}
                className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl hover:bg-amber-400 shadow-xl transition-all"
              >
                Finalize Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
