
import React from 'react';
import Navbar from '../components/Navbar';
import Pricing from '../components/Pricing';
import { PricingPlan } from '../types';

const LandingPage: React.FC = () => {
  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === 'free') {
      window.location.hash = '#/evaluate';
    } else {
      // Redirect to membership view to initiate the new Sovereign Commission flow
      window.location.hash = '#/membership';
    }
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToEvaluate = () => {
    window.location.hash = '#/evaluate';
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] paper-texture">
      <Navbar />
      
      {/* Sovereign Hero Section */}
      <section className="relative py-16 lg:py-32 overflow-hidden bg-white border-b border-[#A68966]/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#141E30]/5 skew-x-[-12deg] translate-x-32 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000 text-center lg:text-left">
              <div className="inline-flex items-center gap-4 border border-[#A68966]/30 px-5 py-2 rounded-sm bg-[#F9F7F2] mb-6 lg:mb-10 mx-auto lg:mx-0">
                <div className="w-1.5 h-1.5 bg-[#A68966] rounded-full animate-pulse"></div>
                <span className="text-[8px] lg:text-[10px] font-bold text-[#141E30] tracking-[0.2em] lg:tracking-[0.3em] uppercase">Department: Strategic Immigration Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-[#141E30] leading-[1.1] mb-6 lg:mb-8">
                The Definitive Gateway to <span className="italic text-[#A68966]">Status.</span>
              </h1>
              <p className="text-lg lg:text-xl text-[#5C5C5C] font-serif italic mb-8 lg:mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Secure the EB1A and O1 Visas through the most sophisticated jurisprudential AI ever commissioned for the world's extraordinary elite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                <button 
                  onClick={navigateToEvaluate}
                  className="bg-[#141E30] text-[#F9F7F2] px-10 lg:px-12 py-4 lg:py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1B3022] transition-all shadow-2xl text-center"
                >
                  Initiate Deposition
                </button>
                <button 
                  onClick={scrollToPricing}
                  className="border border-[#A68966] text-[#A68966] px-10 lg:px-12 py-4 lg:py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#F9F7F2] transition-all text-center"
                >
                  View Commissions
                </button>
              </div>
              <div className="mt-12 lg:mt-16 flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-sm" alt="Member" />
                   ))}
                </div>
                <div className="h-px w-8 bg-[#A68966]/20 lg:h-8 lg:w-px"></div>
                <span className="text-[8px] lg:text-[10px] font-bold text-[#8C8C8C] uppercase tracking-[0.2em]">Trusted by Five Thousand Distinguished Visionaries</span>
              </div>
            </div>
            
            {/* Visual Panel */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 mt-8 lg:mt-0">
              <div className="bg-[#141E30] p-6 lg:p-12 border border-[#A68966]/30 shadow-2xl relative">
                 <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-[#A68966]/10 rounded-bl-full"></div>
                 <div className="flex items-center justify-between mb-8 lg:mb-12">
                    <div className="space-y-2">
                      <div className="h-1 w-16 lg:w-24 bg-[#A68966]"></div>
                      <div className="text-[8px] lg:text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em]">Confidential Dossier</div>
                    </div>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                      <span className="text-white font-serif italic text-3xl lg:text-4xl">E</span>
                    </div>
                 </div>
                 <div className="space-y-6 lg:space-y-8">
                    <div className="p-4 lg:p-6 bg-white/5 border border-white/10">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[8px] lg:text-[9px] font-bold uppercase text-[#A68966] tracking-[0.2em]">EB1A Merit Quotient</span>
                          <span className="text-xl lg:text-2xl font-serif text-white tracking-widest">88.4%</span>
                       </div>
                       <div className="w-full bg-white/5 h-0.5 relative">
                          <div className="bg-[#A68966] h-full w-[88%] shadow-[0_0_10px_#A68966]"></div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:gap-8">
                       <div className="p-4 lg:p-6 bg-white/5 border border-white/10 text-center">
                          <div className="text-2xl lg:text-3xl font-serif text-white mb-1">07</div>
                          <div className="text-[7px] lg:text-[8px] uppercase text-[#A68966] font-bold tracking-widest">Criteria Validated</div>
                       </div>
                       <div className="p-4 lg:p-6 bg-[#1B3022] border border-[#A68966]/20 text-center">
                          <div className="text-base lg:text-lg font-serif italic text-white mb-1">Elite</div>
                          <div className="text-[7px] lg:text-[8px] uppercase text-[#A68966] font-bold tracking-widest">Approval Index</div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-8 pt-6 lg:mt-10 lg:pt-8 border-t border-white/5 text-[9px] lg:text-[10px] text-[#8C8C8C] leading-relaxed italic font-serif">
                    "The neural precision of the Sovereign Edition identified with absolute clarity where my professional narrative required refinement."
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Hall */}
      <section className="py-16 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center lg:text-left">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {[
                { 
                  title: 'Judicial Rigor', 
                  desc: 'Our models are cultivated on exhaustive case law precedents to provide accurate analysis with a formal, authoritative edge.',
                  icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V22'
                },
                { 
                  title: 'Executive Counsel', 
                  desc: 'Receive a comprehensive strategic mandate in under sixty seconds, formatted with the precision required for executive review.',
                  icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                },
                { 
                  title: 'Secure Archival', 
                  desc: 'Your professional history is treated with absolute discretion, shielded by vault-class encryption protocols.',
                  icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                }
              ].map((feat, i) => (
                <div key={i} className="group cursor-default flex flex-col items-center lg:items-start">
                   <div className="w-14 h-14 lg:w-16 lg:h-16 border border-[#A68966]/20 flex items-center justify-center text-[#141E30] mb-6 lg:mb-8 group-hover:bg-[#141E30] group-hover:text-white transition-all duration-500">
                      <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={feat.icon} /></svg>
                   </div>
                   <h3 className="text-lg lg:text-xl font-serif text-[#141E30] mb-3 lg:mb-4 uppercase tracking-widest">{feat.title}</h3>
                   <p className="text-sm text-[#5C5C5C] lg:leading-loose italic px-4 lg:px-0">{feat.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <Pricing onSelectPlan={handleSelectPlan} />

      {/* Sovereign Footer */}
      <footer className="bg-[#141E30] text-[#F9F7F2] py-16 lg:py-20 border-t border-[#A68966]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-12 text-center lg:text-left">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                    <span className="font-serif font-bold text-3xl lg:text-4xl text-[#A68966]">E</span>
                </div>
                <div>
                   <p className="font-serif text-lg lg:text-xl tracking-widest uppercase font-bold leading-tight">EB1X US</p>
                   <p className="text-[7px] lg:text-[8px] font-bold text-[#A68966] uppercase tracking-[0.4em]">The Sovereign Bureau</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6 lg:gap-12 text-[8px] lg:text-[10px] font-bold text-[#8C8C8C] uppercase tracking-[0.2em] lg:tracking-[0.3em]">
                <a href="#/atrium" className="hover:text-[#A68966] transition-colors">Repository</a>
                <a href="#/evaluate" className="hover:text-[#A68966] transition-colors">Protocols</a>
                <a href="#/counsel" className="hover:text-[#A68966] transition-colors">Counsel</a>
              </div>
              <div className="text-[8px] lg:text-[9px] text-[#A68966]/60 font-bold uppercase tracking-[0.1em] lg:tracking-[0.2em]">
                 © 2024 EB1X US Sovereign Bureau. Not affiliated with USCIS. All rights reserved.
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
