
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import AssessmentPage from './pages/AssessmentPage';
import Billing from './views/Billing';
import ImageStudio from './views/ImageStudio';
import VoiceCounsel from './views/VoiceCounsel';
import ChatBot from './components/ChatBot';
import LandingPage from './pages/LandingPage';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApiKeyAuthorized, setIsApiKeyAuthorized] = useState<boolean | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setIsApiKeyAuthorized(hasKey);
        } catch (e) {
          setIsApiKeyAuthorized(false);
        }
      } else {
        // Fallback for direct environment usage where API_KEY is injected
        setIsApiKeyAuthorized(true);
      }
      setIsBooting(false);
    };
    checkAuth();
  }, []);

  const handleAuthorize = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setIsApiKeyAuthorized(true);
        window.location.hash = '#/atrium';
      } catch (err) {
        console.error("Authorization failed", err);
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === '/' || hash === '') {
        setCurrentView('landing');
      } else if (hash === '/atrium') {
        setCurrentView('dashboard');
      } else if (hash === '/evaluate') {
        setCurrentView('assessment');
      } else if (hash === '/studio') {
        setCurrentView('studio');
      } else if (hash === '/counsel') {
        setCurrentView('counsel');
      } else if (hash === '/membership') {
        setCurrentView('billing');
      } else if (hash === '/reauthorize') {
        setIsApiKeyAuthorized(false);
        setCurrentView('landing');
      } else {
        setCurrentView('landing');
      }
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: AppView) => {
    const hashMap: Record<AppView, string> = {
      landing: '/',
      dashboard: '/atrium',
      assessment: '/evaluate',
      studio: '/studio',
      counsel: '/counsel',
      billing: '/membership',
      history: '/atrium'
    };
    window.location.hash = hashMap[view] || '/';
  };

  // Booting State to prevent white screen
  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-t-2 border-[#A68966] rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-[#141E30] tracking-widest uppercase text-xs">Initializing Sovereign Engine</p>
        </div>
      </div>
    );
  }

  if (isApiKeyAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] paper-texture flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#A68966]/30 p-12 shadow-2xl text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-24 border border-[#A68966]/10 flex items-center justify-center mx-auto mb-8 bg-white shadow-sm">
            <span className="text-[#141E30] font-serif font-bold text-5xl">E</span>
          </div>
          <h2 className="text-3xl font-serif text-[#141E30] mb-4">Bureau Credentials Required</h2>
          <p className="text-sm text-[#5C5C5C] font-serif italic mb-10 leading-relaxed">
            The Consular Chambers and Evaluation Engines require a professional, billing-enabled API key from a valid GCP project to function.
          </p>
          <button 
            onClick={handleAuthorize}
            className="w-full py-5 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#1B3022] transition-all shadow-xl mb-6"
          >
            Authorize Bureau Access
          </button>
          <div className="flex flex-col gap-4">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em] hover:underline"
            >
              Consult Billing Documentation
            </a>
            <button 
              onClick={() => setIsApiKeyAuthorized(true)}
              className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#141E30]"
            >
              Manual Bypass
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'assessment') {
    return <AssessmentPage />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#F9F7F2] overflow-hidden paper-texture">
      <div className={`fixed inset-0 z-50 lg:relative lg:flex lg:z-0 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="absolute inset-0 bg-[#141E30]/60 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
        <Sidebar 
          currentView={currentView} 
          onNavigate={navigate} 
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-[#A68966]/20 flex items-center justify-between px-4 lg:px-8 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#141E30]"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
             </button>
             <h1 className="text-xs lg:text-sm font-bold text-[#141E30] uppercase tracking-[0.2em] truncate max-w-[150px] lg:max-w-none">
              {
                currentView === 'dashboard' ? 'Sovereign Atrium' : 
                currentView === 'studio' ? 'Portrait Refinement' : 
                currentView === 'counsel' ? 'Consular Chambers' :
                currentView === 'billing' ? 'Membership' :
                currentView
              }
            </h1>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[8px] lg:text-[10px] font-bold text-[#A68966] tracking-widest uppercase">Elite Member</span>
              <span className="text-[10px] lg:text-xs font-serif italic text-[#141E30]">Arthur Pendleton</span>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-[#A68966]/30 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full">
            {currentView === 'dashboard' && <Dashboard onStart={() => navigate('assessment')} />}
            {currentView === 'studio' && <ImageStudio />}
            {currentView === 'counsel' && <VoiceCounsel />}
            {currentView === 'billing' && <Billing />}
          </div>
        </div>

        <ChatBot />
      </main>
    </div>
  );
};

export default App;
