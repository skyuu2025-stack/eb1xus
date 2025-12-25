
import React, { useState } from 'react';
import { PRICING_PLANS } from '../constants';
import { PricingPlan } from '../types';

const Billing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<PricingPlan | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePaymentInitiation = (plan: PricingPlan) => {
    if (plan.id === 'free') {
      window.location.hash = '#/evaluate';
      return;
    }
    setActivePlan(plan);
    setCheckoutStep('details');
  };

  const executeAuthorization = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      setTimeout(() => {
        window.location.hash = '#/atrium';
      }, 2500);
    }, 3000);
  };

  return (
    <div className="animate-in fade-in duration-1000 space-y-16 py-12 relative">
      <div className="text-center max-w-3xl mx-auto border-b border-[#A68966]/20 pb-12">
        <h2 className="text-5xl font-serif text-[#141E30] mb-6">Subscription Commission</h2>
        <p className="text-sm text-[#8C8C8C] font-medium tracking-[0.15em] uppercase leading-loose">
          Secure your professional trajectory with the industry's most prestigious <br/> AI evaluation suite. Transactions processed via <span className="text-[#A68966] font-bold">Airwallex Global</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRICING_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white p-10 border transition-all duration-500 relative flex flex-col ${
              plan.isPopular ? 'border-[#A68966] shadow-2xl scale-105' : 'border-slate-100'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A68966] text-[#F9F7F2] text-[8px] font-bold uppercase px-6 py-1 tracking-[0.3em]">Consular Selection</span>
            )}
            <h3 className="text-lg font-serif text-[#141E30] mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-10 border-b border-slate-50 pb-6">
              <span className="text-4xl font-serif text-[#141E30]">${plan.price}</span>
              <span className="text-[#8C8C8C] ml-1 text-[10px] font-bold uppercase tracking-widest">/{plan.period === 'free' ? 'once' : plan.period}</span>
            </div>
            
            <ul className="space-y-6 mb-12 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex gap-4 text-[11px] text-[#4A4A4A] font-medium tracking-wide leading-relaxed">
                  <svg className="w-3.5 h-3.5 text-[#1B3022] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handlePaymentInitiation(plan)}
              className={`w-full py-4 font-bold text-[9px] uppercase tracking-[0.3em] transition-all duration-300 ${
                plan.id === 'free' 
                ? 'bg-slate-50 text-slate-400 hover:bg-slate-100' 
                : 'bg-[#141E30] text-[#F9F7F2] hover:bg-[#A68966] shadow-xl'
              }`}
            >
              {plan.id === 'free' ? 'Enter Atrium' : `Authorize Commission`}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 border border-[#A68966]/20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 border border-[#A68966]/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#A68966]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           </div>
           <div>
              <h4 className="text-[#141E30] font-serif text-xl mb-1">Vault-Class Security</h4>
              <p className="text-[#8C8C8C] text-xs font-medium uppercase tracking-widest leading-relaxed">All transactions are managed via an exclusive, secure ledger through Airwallex Global systems.</p>
           </div>
        </div>
        <div className="flex gap-10 opacity-30 grayscale contrast-125">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="paypal" />
        </div>
      </div>

      {/* Sovereign Commission Portal Modal */}
      {activePlan && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#141E30]/80 backdrop-blur-sm" onClick={() => setCheckoutStep('details') === 'details' && setActivePlan(null)}></div>
          
          <div className="bg-white max-w-xl w-full border border-[#A68966] shadow-2xl relative z-10 paper-texture overflow-hidden">
            {checkoutStep === 'details' && (
              <div className="p-8 lg:p-12 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-10 border-b border-[#A68966]/20 pb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-[#141E30]">Commission Authorization</h3>
                    <p className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mt-1">Secure Protocol • Powered by Airwallex</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif text-[#141E30]">${activePlan.price}</span>
                    <p className="text-[8px] font-bold text-[#8C8C8C] uppercase tracking-widest">Authorized Amount</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3">Professional Billing Identifier</label>
                    <input type="text" placeholder="Cardholder Name" className="w-full bg-slate-50 p-4 border-b border-slate-200 outline-none focus:border-[#A68966] text-xs font-medium transition-all" />
                  </div>
                  
                  <div className="group">
                    <label className="block text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3">Card Mandate Details</label>
                    <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 p-4 border-b border-slate-200 outline-none focus:border-[#A68966] text-xs font-medium tracking-widest transition-all" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="mc" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3">Expiration</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 p-4 border-b border-slate-200 outline-none focus:border-[#A68966] text-xs font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3">CVV</label>
                      <input type="text" placeholder="***" className="w-full bg-slate-50 p-4 border-b border-slate-200 outline-none focus:border-[#A68966] text-xs font-medium transition-all" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={executeAuthorization}
                  className="w-full mt-10 py-5 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#1B3022] transition-all shadow-xl"
                >
                  Confirm Secure Authorization
                </button>
                
                <p className="mt-8 text-center text-[8px] text-[#8C8C8C] font-bold uppercase tracking-[0.2em] opacity-60 flex items-center justify-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  End-to-End Vault Encryption • Airwallex PCI-DSS Certified
                </p>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="p-20 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 border-2 border-[#A68966]/20 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 border-2 border-t-[#A68966] rounded-full animate-spin"></div>
                  <span className="font-serif text-3xl text-[#141E30]">E</span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#141E30] mb-3">Verifying Sovereign Funds</h3>
                  <p className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em] animate-pulse">Establishing Secure Consular Link...</p>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in slide-in-from-top-4">
                <div className="w-24 h-24 bg-[#1B3022] rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-[#141E30] mb-4">Commission Authorized</h3>
                  <p className="text-sm text-[#5C5C5C] font-serif italic max-w-xs mx-auto">
                    "The Bureau acknowledges your investment. Your elite credentials are now active within the Sovereign Registry."
                  </p>
                </div>
                <div className="text-[9px] font-bold text-[#A68966] uppercase tracking-[0.4em] animate-pulse">
                  Redirecting to the Atrium...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
