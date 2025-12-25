
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard' as AppView, label: 'The Atrium', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'assessment' as AppView, label: 'Evaluation Protocol', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'counsel' as AppView, label: 'Consular Chambers', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'studio' as AppView, label: 'The Portrait Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'billing' as AppView, label: 'Commission Registry', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  ];

  const navigateTo = (viewId: AppView) => {
    onNavigate(viewId);
  };

  return (
    <aside className="w-72 lg:w-64 bg-white border-r border-[#A68966]/20 flex flex-col h-full shadow-2xl lg:shadow-lg relative">
      <button 
        onClick={() => setIsOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 text-[#A68966]"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div 
        onClick={() => navigateTo('landing')}
        className="p-8 flex flex-col items-center border-b border-[#A68966]/10 cursor-pointer hover:bg-[#F9F7F2] transition-colors group"
      >
        <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white border border-[#A68966]/10 group-hover:border-[#A68966]/30 shadow-sm transition-all">
          <span className="font-serif text-4xl font-bold text-[#141E30] group-hover:text-[#A68966]">E</span>
        </div>
        <span className="font-serif text-xl tracking-[0.2em] font-medium text-[#141E30] uppercase group-hover:text-[#A68966] transition-colors">EB1X US</span>
        <span className="text-[10px] text-[#A68966] font-bold tracking-[0.3em] uppercase mt-1 text-center">Sovereign Edition</span>
      </div>

      <nav className="flex-1 mt-6 lg:mt-10 px-6 space-y-2 lg:space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-300 group ${
              currentView === item.id 
              ? 'text-[#141E30] font-bold bg-[#F9F7F2]' 
              : 'text-[#8C8C8C] hover:text-[#141E30]'
            } rounded-sm`}
          >
            <svg className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-[#A68966]' : 'text-slate-300 group-hover:text-[#A68966]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
            </svg>
            <span className="text-sm tracking-wide uppercase font-medium">{item.label}</span>
            {currentView === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A68966]"></div>}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-[#A68966]/10 space-y-4">
        <div className="bg-[#141E30] p-4 rounded-sm text-center">
           <p className="text-[9px] font-bold text-[#A68966] tracking-widest uppercase mb-1">Status</p>
           <p className="text-xs text-[#F9F7F2] font-serif italic">Elite Member</p>
        </div>
        <button 
          onClick={() => navigateTo('landing')}
          className="w-full flex items-center justify-center gap-2 text-[9px] font-bold text-[#8C8C8C] hover:text-[#A68966] uppercase tracking-[0.3em] transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Exit Bureau
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
