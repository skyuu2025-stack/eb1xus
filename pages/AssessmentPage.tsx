
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { VisaType, AssessmentData, Criterion } from '../types';
import { EB1A_CRITERIA, O1_CRITERIA } from '../constants';
import { analyzeVisaEligibility } from '../services/geminiService';

const AssessmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AssessmentData>({
    visaType: VisaType.EB1A,
    name: '',
    field: '',
    criteriaScores: {},
    resumeText: ''
  });
  const [result, setResult] = useState<any>(null);

  const activeCriteria = formData.visaType === VisaType.EB1A ? EB1A_CRITERIA : O1_CRITERIA;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeVisaEligibility(formData);
      setResult(analysis);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert('The formal evaluation encountered a protocol error. Please re-initiate.');
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    window.location.hash = '#/';
  };

  const goAtrium = () => {
    window.location.hash = '#/atrium';
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] paper-texture">
      <div className="no-print">
        <Navbar />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 print-area">
        <div className="mb-8 lg:mb-12 no-print">
           <button 
             onClick={goHome}
             className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em] hover:text-[#141E30] transition-colors flex items-center gap-2"
           >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Withdraw Inquiry
           </button>
        </div>

        {step < 4 && (
          <div className="mb-12 lg:mb-20 no-print">
            <div className="flex justify-between items-center mb-8 relative">
               <div className="absolute top-1/2 left-0 w-full h-px bg-[#A68966]/10 -z-10"></div>
               {[
                 { id: 1, label: 'Preliminary Registry' },
                 { id: 2, label: 'Evidentiary Filing' },
                 { id: 3, label: 'Final Deposition' }
               ].map(i => (
                 <div key={i.id} className="flex flex-col items-center gap-2 lg:gap-4 bg-[#F9F7F2] px-2 lg:px-4 text-center">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 border flex items-center justify-center font-serif text-lg lg:text-xl transition-all duration-700 ${
                      step >= i.id ? 'bg-[#141E30] text-white border-[#141E30]' : 'bg-white text-slate-300 border-slate-100'
                    }`}>
                      {i.id}
                    </div>
                    <span className={`text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] max-w-[60px] lg:max-w-none ${step >= i.id ? 'text-[#141E30]' : 'text-slate-300'}`}>
                       {i.label}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white p-6 sm:p-12 lg:p-16 border border-[#A68966]/20 shadow-2xl animate-in fade-in duration-700">
            <h2 className="text-3xl lg:text-4xl font-serif text-[#141E30] mb-2">Subject Dossier</h2>
            <p className="text-[10px] text-[#A68966] font-bold uppercase tracking-[0.4em] mb-8 lg:mb-12">Preliminary Intake Protocol</p>
            <div className="space-y-8 lg:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="group">
                  <label className="block text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3 lg:mb-4">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 p-4 lg:p-5 text-[#141E30] font-serif text-lg lg:text-xl italic border-l-2 border-transparent focus:border-[#A68966] outline-none transition-all" 
                    placeholder="Enter Name as shown on Passport"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3 lg:mb-4">Field of Endeavor</label>
                  <input 
                    type="text" 
                    value={formData.field}
                    onChange={e => setFormData({...formData, field: e.target.value})}
                    className="w-full bg-slate-50 p-4 lg:p-5 text-[#141E30] font-serif text-lg lg:text-xl italic border-l-2 border-transparent focus:border-[#A68966] outline-none transition-all" 
                    placeholder="e.g., Quantum Physics, Corporate Law"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-4 lg:mb-6">Visa Classification Inquiry</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
                  {[VisaType.EB1A, VisaType.O1].map(v => (
                    <button 
                      key={v}
                      onClick={() => setFormData({...formData, visaType: v})}
                      className={`p-6 lg:p-8 border transition-all text-center ${
                        formData.visaType === v 
                          ? 'border-[#A68966] bg-[#F9F7F2] text-[#141E30] shadow-inner' 
                          : 'border-[#A68966]/10 text-slate-300 hover:border-[#A68966]/30'
                      }`}
                    >
                      <div className="font-serif text-2xl lg:text-3xl mb-1">{v}</div>
                      <div className="text-[8px] font-bold uppercase tracking-[0.2em]">
                        {v === VisaType.EB1A ? 'Employment-Based First Preference' : 'Individuals with Extraordinary Ability'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.field}
                className="w-full py-5 lg:py-6 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#1B3022] transition shadow-xl disabled:opacity-50"
              >
                Proceed to Evidentiary Filing
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 lg:space-y-12 animate-in slide-in-from-right-8 duration-700">
            <div className="bg-white p-6 sm:p-12 border border-[#A68966]/20">
              <h2 className="text-3xl lg:text-4xl font-serif text-[#141E30] mb-2">Evidentiary Ledger</h2>
              <p className="text-[10px] text-[#A68966] font-bold uppercase tracking-[0.4em] mb-10 lg:mb-12">Regulatory Criteria Mapping for {formData.visaType}</p>
              
              <div className="space-y-12 lg:space-y-16">
                {activeCriteria.map((c: Criterion) => (
                  <div key={c.id} className="group pb-10 lg:pb-12 border-b border-[#A68966]/10 last:border-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-2">
                      <div className="max-w-xl">
                        <h3 className="font-serif text-xl lg:text-2xl text-[#141E30] mb-2 tracking-wide">{c.title}</h3>
                        <p className="text-sm text-[#8C8C8C] italic leading-relaxed">{c.description}</p>
                      </div>
                      <div className="text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em] border border-[#A68966]/20 px-3 py-1 shrink-0">Index: {c.id}</div>
                    </div>
                    <textarea 
                      placeholder="Detail specific accomplishments, awards, or roles relevant to this criterion..."
                      className="w-full bg-slate-50 p-4 lg:p-6 text-base lg:text-lg font-serif italic text-[#141E30] border-l-2 border-transparent focus:border-[#A68966] outline-none transition-all resize-none"
                      rows={3}
                      value={formData.criteriaScores[c.id] || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        criteriaScores: {...formData.criteriaScores, [c.id]: e.target.value}
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-10 no-print">
               <button onClick={() => setStep(1)} className="w-full sm:flex-1 py-5 border border-[#A68966]/30 text-[#A68966] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition">Previous Phase</button>
               <button onClick={() => setStep(3)} className="w-full sm:flex-[2] py-5 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1B3022] transition shadow-xl">Confirm Evidentiary Filing</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 sm:p-16 border border-[#A68966]/20 shadow-2xl animate-in zoom-in-95 duration-700">
            <h2 className="text-3xl lg:text-4xl font-serif text-[#141E30] mb-2">Final Deposition</h2>
            <p className="text-[10px] text-[#A68966] font-bold uppercase tracking-[0.4em] mb-8 lg:mb-12">Professional Narrative & Global Impact Statement</p>
            <textarea 
              value={formData.resumeText}
              onChange={e => setFormData({...formData, resumeText: e.target.value})}
              className="w-full bg-slate-50 p-6 lg:p-10 h-72 lg:h-96 text-lg lg:text-2xl font-serif italic text-[#141E30] border-l-2 border-[#A68966]/20 focus:border-[#A68966] transition-all outline-none"
              placeholder="State your narrative... Include major breakthroughs, peer influence, and future intent in the United States."
            />
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-10 lg:mt-12 py-5 lg:py-6 bg-[#1B3022] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:bg-[#141E30] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-[#F9F7F2]/20 border-t-[#F9F7F2] rounded-full"></span>
              ) : null}
              {loading ? 'Processing Sovereign Data...' : 'Execute Jurisprudential Analysis'}
            </button>
          </div>
        )}

        {step === 4 && result && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 print:mt-0">
            <div className="bg-white p-6 sm:p-10 lg:p-20 border border-[#A68966]/20 shadow-2xl relative print:border-none print:p-0">
               <div className="absolute top-6 lg:top-10 right-6 lg:right-10 text-[8px] lg:text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em] lg:tracking-[0.4em] print:top-0 print:right-0">Confidential Determination</div>
               <div className="text-center mb-12 lg:mb-24 border-b border-[#A68966]/10 pb-10 lg:pb-16 print:mb-10 print:pb-8">
                  <h2 className="text-3xl lg:text-5xl font-serif text-[#141E30] mb-4">Evaluation Decree</h2>
                  <div className="w-24 lg:w-32 h-0.5 bg-[#A68966] mx-auto"></div>
                  <p className="text-[9px] lg:text-xs text-[#8C8C8C] font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] mt-6 lg:mt-8">Petitioner: {formData.name}</p>
               </div>

               <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center mb-12 lg:mb-20 p-6 lg:p-12 bg-[#F9F7F2] print:bg-white print:border print:border-[#A68966]/10 print:mb-10">
                  <div className="relative w-36 lg:w-48 h-36 lg:h-48 flex-shrink-0">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-slate-100" strokeWidth="2" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle className="text-[#1B3022]" strokeWidth="5" strokeDasharray={283} strokeDashoffset={283 - (283 * result.overallScore) / 100} stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl lg:text-4xl font-serif text-[#141E30]">{result.overallScore}%</span>
                        <span className="text-[8px] lg:text-[9px] font-bold text-[#A68966] uppercase tracking-[0.2em]">Approval Index</span>
                     </div>
                  </div>
                  <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                     <h3 className="text-xl lg:text-2xl font-serif text-[#141E30] italic">Bureau Determination</h3>
                     <p className="text-base lg:text-xl text-[#5C5C5C] leading-relaxed lg:leading-[2] font-serif italic">
                        "Following a rigorous audit with neural search grounding, the Bureau identifies a {result.overallScore}% probability of a successful outcome. The profile is evaluated against real-time jurisprudential shifts."
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 mb-12 lg:mb-20 print:mb-10">
                  <div className="space-y-6 lg:space-y-8 print-break-inside-avoid">
                     <h4 className="text-[10px] lg:text-[11px] font-bold text-[#141E30] uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Validated Proficiencies</h4>
                     {result.qualifiedCriteria.map((c: string, i: number) => (
                        <div key={i} className="flex gap-4 lg:gap-6 items-start">
                           <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#1B3022] mt-1.5 flex-shrink-0"></div>
                           <span className="text-xs lg:text-sm text-[#4A4A4A] tracking-wide font-medium leading-relaxed uppercase">{c}</span>
                        </div>
                     ))}
                  </div>
                  <div className="space-y-6 lg:space-y-8 print-break-inside-avoid">
                     <h4 className="text-[10px] lg:text-[11px] font-bold text-[#141E30] uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Areas for Augmentation</h4>
                     {result.weakCriteria.map((c: string, i: number) => (
                        <div key={i} className="flex gap-4 lg:gap-6 items-start">
                           <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#A68966] mt-1.5 flex-shrink-0"></div>
                           <span className="text-xs lg:text-sm text-[#4A4A4A] tracking-wide font-medium leading-relaxed uppercase">{c}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="p-6 lg:p-16 border border-[#A68966]/20 bg-[#FBFBFB] mb-12 lg:mb-20 print:p-8 print:border-[#A68966]/10 print:mb-10 print-break-inside-avoid">
                  <h4 className="text-[10px] lg:text-[11px] font-bold text-[#141E30] uppercase tracking-[0.3em] mb-6 lg:mb-10">Strategic Mandate</h4>
                  <div className="text-lg lg:text-2xl text-[#4A4A4A] leading-[1.8] lg:leading-[2.2] font-serif italic whitespace-pre-wrap">
                     {result.strategicPlan}
                  </div>
               </div>

               {result.sources && result.sources.length > 0 && (
                 <div className="mb-12 lg:mb-20 print:mb-10">
                    <h4 className="text-[10px] lg:text-[11px] font-bold text-[#141E30] uppercase tracking-[0.3em] mb-6 border-b border-slate-100 pb-4">Grounding References</h4>
                    <div className="flex flex-col gap-3">
                      {result.sources.map((chunk: any, idx: number) => (
                        chunk.web && (
                          <a 
                            key={idx} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#A68966] hover:text-[#141E30] transition-colors font-bold uppercase tracking-widest flex items-center gap-2"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                            {chunk.web.title || chunk.web.uri}
                          </a>
                        )
                      ))}
                    </div>
                 </div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 no-print">
                  <button onClick={goHome} className="py-4 border border-[#A68966]/40 text-[#A68966] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-50 transition">Home Return</button>
                  <button onClick={goAtrium} className="py-4 border border-[#141E30] text-[#141E30] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-50 transition">Atrium Registry</button>
                  <button onClick={() => window.print()} className="py-4 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#1B3022] transition shadow-2xl">Download PDF Decree</button>
               </div>
               
               <div className="hidden print:block mt-20 border-t border-slate-100 pt-8 text-[8px] text-[#8C8C8C] uppercase tracking-widest text-center">
                  Certified Sovereign Document • EB1X US Bureau • Confidential
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
