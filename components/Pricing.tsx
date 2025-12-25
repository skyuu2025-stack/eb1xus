
import React from 'react';
import { PRICING_PLANS } from '../constants';
import { PricingPlan } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-32 bg-[#F9F7F2] paper-texture">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-24 border-b border-[#A68966]/20 pb-16">
          <h2 className="text-5xl font-serif text-[#141E30] mb-6">Select Your Success Roadmap</h2>
          <p className="text-[#8C8C8C] max-w-2xl mx-auto text-sm font-medium tracking-wide uppercase leading-loose">
            Secure, premium capital transfers powered by <span className="text-[#141E30] font-bold">Airwallex</span>. <br/> Access the world's most sophisticated legal intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative p-12 bg-white border flex flex-col transition-all duration-500 hover:translate-y-[-8px] ${
                plan.isPopular ? 'border-[#A68966] shadow-2xl scale-105' : 'border-[#A68966]/10'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A68966] text-white text-[8px] font-bold px-6 py-1 tracking-[0.3em] uppercase">
                  Elite Choice
                </span>
              )}
              <h3 className="text-lg font-serif text-[#141E30] mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-10 border-b border-slate-50 pb-6">
                <span className="text-4xl font-serif text-[#141E30]">${plan.price}</span>
                <span className="text-[#8C8C8C] ml-1 text-[10px] font-bold uppercase tracking-widest">/{plan.period === 'free' ? 'once' : plan.period}</span>
              </div>
              <ul className="space-y-6 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-[11px] text-[#4A4A4A] font-medium tracking-wide leading-relaxed">
                    <svg className="w-4 h-4 text-[#1B3022] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-4 font-bold text-[9px] uppercase tracking-[0.3em] transition-all duration-300 ${
                  plan.id === 'free' 
                    ? 'border border-[#A68966]/30 text-[#A68966] hover:bg-[#F9F7F2]' 
                    : 'bg-[#141E30] text-[#F9F7F2] hover:bg-[#A68966] shadow-xl'
                }`}
              >
                {plan.id === 'free' ? 'Join Atrium' : 'Authorize Membership'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
