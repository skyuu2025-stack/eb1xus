
import React, { useState } from 'react';
import { getQuickInsight } from '../services/geminiService';

interface DashboardProps {
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  const [insightQuery, setInsightQuery] = useState('');
  const [quickInsight, setQuickInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuickInsight = async () => {
    if (!insightQuery.trim() || loading) return;
    setLoading(true);
    setQuickInsight(null);
    try {
      const insight = await getQuickInsight(insightQuery);
      setQuickInsight(insight);
    } catch (error) {
      console.error(error);
      setQuickInsight("The Bureau's neural link is momentarily congested. Please re-state your inquiry.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickInsight();
    }
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row justify-between lg:items-baseline border-b border-[#A68966]/20 pb-6 gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-serif text-[#141E30]">Good Morning, Distinguished Member</h2>
          <p className="text-[10px] lg:text-sm text-[#8C8C8C] font-medium tracking-wide mt-2 uppercase">Private Immigration Bureau Registry</p>
        </div>
        <button 
          onClick={onStart}
          className="brass-button w-full lg:w-auto px-6 lg:px-10 py-3 rounded-sm font-medium text-[10px] lg:text-xs tracking-[0.2em] uppercase shadow-sm"
        >
          Commission New Dossier
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
        {[
          { label: 'Archived Files', value: '12', icon: 'M12 8v4l3 3' },
          { label: 'Approval Probability', value: '84.2%', icon: 'M9 12l2 2 4-4' },
          { label: 'Intelligence Reports', value: 'Unlimited', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 lg:p-8 border border-[#A68966]/10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <svg className="w-12 h-12 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
            </div>
            <p className="text-[8px] lg:text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-2 lg:mb-4">{stat.label}</p>
            <p className="text-2xl lg:text-3xl font-serif text-[#141E30]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Recent Portfolios */}
        <div className="bg-white p-6 lg:p-10 border border-[#A68966]/30">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h3 className="text-lg lg:text-xl font-serif text-[#141E30]">Active Dossiers</h3>
            <span className="text-[8px] lg:text-[10px] font-bold text-[#A68966] uppercase cursor-pointer hover:underline">View All Registry</span>
          </div>
          <div className="space-y-4 lg:space-y-6">
            {[
              { name: 'Arthur Pendleton', type: 'EB1A', date: '22 Oct, 2024' },
              { name: 'Catherine Vane', type: 'O-1A', date: '21 Oct, 2024' },
              { name: 'Dr. Alistair Cook', type: 'EB1A', date: '19 Oct, 2024' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer pb-3 lg:pb-4 border-b border-slate-50 last:border-0 hover:border-[#A68966]/20 transition-all">
                <div>
                  <p className="font-medium text-[#141E30] text-xs lg:text-sm tracking-wide">{item.name}</p>
                  <p className="text-[8px] lg:text-[10px] text-[#8C8C8C] uppercase font-bold mt-1">{item.type} • {item.date}</p>
                </div>
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-[#A68966] transition-colors">
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-slate-300 group-hover:text-[#A68966]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Strategy Insight */}
        <div className="bg-white p-6 lg:p-10 border border-[#A68966]/30 flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-lg lg:text-xl font-serif text-[#141E30] mb-3 lg:mb-4">Instant Strategic Counsel</h3>
            <p className="text-[8px] lg:text-[10px] text-[#A68966] font-bold uppercase tracking-widest mb-6">Neural Insights Engine</p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Subject (e.g., 'Evidentiary Standards')"
                className="w-full bg-slate-50 border-b border-[#A68966]/20 p-3 text-[10px] lg:text-xs outline-none focus:border-[#A68966] transition-colors"
                value={insightQuery}
                onChange={(e) => setInsightQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                onClick={handleQuickInsight}
                disabled={loading || !insightQuery}
                className="w-full py-3 bg-[#141E30] text-[#F9F7F2] text-[8px] lg:text-[9px] font-bold uppercase tracking-widest hover:bg-[#1B3022] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-2 h-2 rounded-full bg-[#A68966] animate-ping"></span>}
                {loading ? "Obtaining Council..." : "Request Immediate Insight"}
              </button>
            </div>
          </div>
          {quickInsight && (
            <div className="mt-4 p-4 lg:p-6 bg-[#F9F7F2] border-l-2 border-[#A68966] animate-in slide-in-from-left-2 duration-700">
              <p className="text-[10px] lg:text-xs font-serif italic text-[#141E30] leading-relaxed">
                "{quickInsight}"
              </p>
            </div>
          )}
        </div>

        {/* Strategic Advisory */}
        <div className="bg-[#1B3022] p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-[#A68966]/10 rounded-bl-full"></div>
          <div>
            <h3 className="text-xl lg:text-2xl font-serif text-[#F9F7F2] mb-3 lg:mb-4">Advisory Mandate</h3>
            <p className="text-[#F9F7F2]/60 text-xs lg:text-sm leading-relaxed mb-6 lg:mb-8">
              "Excellence is not a singular act, but a sustained discipline." <br/>
              Our archives are continuously updated with the latest US jurisprudential guidance.
            </p>
          </div>
          <button 
            onClick={() => window.location.hash = '#/counsel'}
            className="w-max px-6 lg:px-8 py-3 bg-[#A68966] text-[#F9F7F2] text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#B69976] transition-colors"
          >
            Access Private Counsel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
