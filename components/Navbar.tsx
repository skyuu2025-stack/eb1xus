
import React from 'react';

const Navbar: React.FC = () => {
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <nav className="bg-white border-b border-[#A68966]/20 sticky top-0 z-50 py-2">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4 lg:gap-6">
            <div 
              onClick={() => navigateTo('/')}
              className="flex items-center gap-4 lg:gap-6 group cursor-pointer"
            >
              <div className="w-10 h-12 lg:w-12 lg:h-12 flex items-center justify-center group-hover:opacity-80 transition-opacity">
                  <span className="text-[#141E30] font-serif font-bold text-3xl lg:text-4xl tracking-tighter group-hover:text-[#A68966]">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base lg:text-lg font-serif font-bold text-[#141E30] tracking-[0.15em] uppercase leading-tight">EB1X US</span>
                <span className="text-[8px] lg:text-[9px] font-bold text-[#A68966] tracking-[0.3em] uppercase">Sovereign Edition</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex space-x-12 text-[10px] font-bold text-[#8C8C8C] uppercase tracking-widest">
            <button onClick={() => navigateTo('#/atrium')} className="hover:text-[#141E30] transition-colors uppercase tracking-widest">The Atrium</button>
            <button onClick={() => navigateTo('#/evaluate')} className="hover:text-[#141E30] transition-colors uppercase tracking-widest">Protocols</button>
            <button onClick={() => navigateTo('#/membership')} className="hover:text-[#141E30] transition-colors uppercase tracking-widest">Memberships</button>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => navigateTo('#/atrium')}
              className="text-[#141E30] text-[10px] font-bold uppercase tracking-widest hover:text-[#A68966] transition-colors"
            >
              Member Login
            </button>
            <button 
              onClick={() => navigateTo('#/evaluate')}
              className="brass-button px-6 lg:px-8 py-2.5 lg:py-3 rounded-sm text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm"
            >
              Initiate Dossier
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
