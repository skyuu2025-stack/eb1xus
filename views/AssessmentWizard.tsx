
import React, { useState } from 'react';
import { VisaType, AssessmentData, Criterion } from '../types';
import { EB1A_CRITERIA, O1_CRITERIA } from '../constants';
import { analyzeVisaEligibility } from '../services/geminiService';

interface AssessmentWizardProps {
  onComplete: () => void;
}

const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onComplete }) => {
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
      alert('The evaluation encountered a formal error.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4 && result) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in slide-in-from-bottom-12 duration-1000">
        <div className="bg-white p-16 border-2 border-[#A68966]/20 shadow-2xl relative">
          <div className="absolute top-8 right-8 text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em]">Confidential</div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#141E30] mb-2">Formal Eligibility Report</h2>
            <div className="w-24 h-0.5 bg-[#A68966] mx-auto mt-4"></div>
            <p className="text-xs text-[#8C8C8C] font-bold uppercase tracking-[0.2em] mt-6">Prepared for: {formData.name}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-16 items-center mb-16 p-8 bg-[#F9F7F2]">
             <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-slate-200" strokeWidth="2" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                  <circle className="text-[#1B3022]" strokeWidth="4" strokeDasharray={283} strokeDashoffset={283 - (283 * result.overallScore) / 100} stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-3xl font-serif text-[#141E30]">{result.overallScore}%</span>
                   <span className="text-[8px] font-bold text-[#A68966] uppercase">Index</span>
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="text-xl font-serif text-[#141E30]">Executive Summary</h3>
                <p className="text-sm text-[#5C5C5C] leading-loose italic">
                  "Our computational jurisprudence indicates a substantial probability of success for the {formData.visaType} petition. The candidate demonstrates a profile aligned with the highest standards of the US immigration code."
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-[#141E30] uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Meritorious Strengths</h4>
              {result.qualifiedCriteria.map((c: string, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1B3022] mt-1.5"></div>
                  <span className="text-sm text-[#4A4A4A] tracking-wide">{c}</span>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-[#141E30] uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Areas of Caution</h4>
              {result.weakCriteria.map((c: string, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A68966] mt-1.5"></div>
                  <span className="text-sm text-[#4A4A4A] tracking-wide">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 border border-[#A68966]/20 bg-[#FBFBFB] mb-12">
             <h4 className="text-sm font-bold text-[#141E30] uppercase tracking-[0.2em] mb-6">Advocacy Roadmap</h4>
             <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-wrap font-serif italic text-lg">{result.strategicPlan}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button onClick={onComplete} className="flex-1 py-4 border border-[#141E30] text-[#141E30] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition">Return to Dashboard</button>
            <button onClick={() => window.print()} className="flex-1 py-4 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1B3022] transition shadow-xl">Engross PDF Dossier</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white border-t-4 border-[#A68966] p-12 shadow-2xl">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in zoom-in-95">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-[#141E30] mb-2">The Dossier Profile</h2>
                <p className="text-[10px] text-[#A68966] font-bold uppercase tracking-[0.3em]">Information Gathering</p>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-3 block">Petitioner Intent</label>
                  <div className="grid grid-cols-2 gap-6">
                    {[VisaType.EB1A, VisaType.O1].map(v => (
                      <button 
                        key={v}
                        onClick={() => setFormData({...formData, visaType: v})}
                        className={`py-4 border-2 transition-all font-serif text-xl ${formData.visaType === v ? 'border-[#A68966] bg-[#F9F7F2] text-[#141E30]' : 'border-slate-50 text-slate-300 hover:border-slate-100'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-2 block">Full Legal Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50/50 border-b-2 border-slate-100 p-4 text-[#141E30] font-serif text-lg focus:border-[#A68966] outline-none transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter legal name..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.2em] mb-2 block">Field of Endeavor</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50/50 border-b-2 border-slate-100 p-4 text-[#141E30] font-serif text-lg focus:border-[#A68966] outline-none transition-colors"
                      value={formData.field}
                      onChange={e => setFormData({...formData, field: e.target.value})}
                      placeholder="Primary specialty..."
                    />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-5 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1B3022] transition shadow-lg">
                  Advance to Evidence Registry
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 h-[65vh] flex flex-col">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-[#141E30] mb-2">Evidence Registry</h2>
                <p className="text-[10px] text-[#A68966] font-bold uppercase tracking-[0.3em]">Categorical Analysis</p>
              </div>
              <div className="flex-1 overflow-y-auto space-y-10 pr-4">
                {activeCriteria.map(c => (
                  <div key={c.id} className="group">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-xs font-bold text-[#141E30] uppercase tracking-wider">{c.title}</label>
                      <span className="text-[8px] text-slate-300 font-bold uppercase">{c.id}</span>
                    </div>
                    <textarea 
                      className="w-full bg-slate-50 p-4 text-sm text-[#141E30] border-l-2 border-transparent focus:border-[#A68966] outline-none transition-all resize-none font-serif text-lg italic"
                      placeholder="Provide brief testimony of evidence..."
                      rows={2}
                      value={formData.criteriaScores[c.id] || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        criteriaScores: {...formData.criteriaScores, [c.id]: e.target.value}
                      })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-6 pt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-4 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-4 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-widest">Proceed</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-[#141E30] mb-2">Professional Context</h2>
                <p className="text-[10px] text-[#A68966] font-bold uppercase tracking-[0.3em]">Final Deposition</p>
              </div>
              <textarea 
                className="w-full bg-slate-50 p-8 h-80 text-[#141E30] font-serif text-xl italic outline-none border-l-2 border-[#A68966]/20 focus:border-[#A68966] transition-all"
                value={formData.resumeText}
                onChange={e => setFormData({...formData, resumeText: e.target.value})}
                placeholder="Curriculum Vitae or detailed summary..."
              />
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-6 bg-[#1B3022] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 hover:bg-[#141E30] transition-all disabled:opacity-50"
              >
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-[#F9F7F2]/20 border-t-[#F9F7F2] rounded-full"></span> : null}
                {loading ? 'Evaluating Merits...' : 'Execute Evaluation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
