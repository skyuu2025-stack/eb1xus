
import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';

const ImageStudio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    try {
      // Remove base64 prefix for the API call
      const base64Data = selectedImage.split(',')[1];
      const result = await editImage(base64Data, prompt);
      if (result) {
        setEditedImage(result);
      }
    } catch (error) {
      console.error('Image editing failed:', error);
      alert('The refinement process encountered a formal error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex justify-between items-baseline border-b border-[#A68966]/20 pb-10">
        <div>
          <h2 className="text-5xl font-serif text-[#141E30]">Portrait Studio</h2>
          <p className="text-sm text-[#8C8C8C] font-medium tracking-[0.2em] mt-3 uppercase">Professional appearance refinement for the Sovereign Petitioner</p>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-bold text-[#A68966] tracking-[0.4em] uppercase">Powered by Gemini 2.5 Image Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Input Chamber */}
        <div className="bg-white p-12 border border-[#A68966]/30 shadow-2xl space-y-12">
          <div>
             <h3 className="text-2xl font-serif text-[#141E30] mb-2 tracking-wide">Original Asset</h3>
             <div className="w-12 h-0.5 bg-[#A68966] mb-8"></div>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-square border border-[#A68966]/20 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F7F2] transition-all relative overflow-hidden bg-slate-50`}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Uploaded Asset" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 border border-[#A68966]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg className="w-8 h-8 text-[#A68966]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
                <p className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em]">Upload Source Portrait</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

          <div className="space-y-6">
            <label className="text-[10px] font-bold text-[#A68966] uppercase tracking-[0.3em] block">Refinement Protocols</label>
            <div className="relative">
              <textarea 
                className="w-full bg-slate-50 p-8 text-[#141E30] font-serif text-2xl italic outline-none border-l-2 border-[#A68966]/20 focus:border-[#A68966] transition-all min-h-[160px] resize-none"
                placeholder="e.g., 'Apply a classic retro filter' or 'Neutralize background elements'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute bottom-4 right-6 flex gap-4">
                 <button onClick={() => setPrompt("Add a subtle retro filter")} className="text-[8px] font-bold uppercase tracking-widest text-[#A68966] hover:text-[#141E30]">Classic Filter</button>
                 <button onClick={() => setPrompt("Remove distracting background elements")} className="text-[8px] font-bold uppercase tracking-widest text-[#A68966] hover:text-[#141E30]">Clean Studio</button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleEdit}
            disabled={loading || !selectedImage || !prompt}
            className="w-full py-6 bg-[#141E30] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 hover:bg-[#1B3022] transition-all disabled:opacity-50"
          >
            {loading ? <span className="animate-spin w-4 h-4 border-2 border-[#F9F7F2]/20 border-t-[#F9F7F2] rounded-full"></span> : null}
            {loading ? 'Executing Refinement...' : 'Authorize Refinement Engine'}
          </button>
        </div>

        {/* Result Vault */}
        <div className="bg-[#141E30] p-16 flex flex-col items-center justify-center relative border border-[#A68966]/20 min-h-[600px] shadow-2xl">
           <div className="absolute top-8 right-8 text-[9px] font-bold text-[#A68966] uppercase tracking-[0.4em]">Vault: Sovereign Output</div>
           {editedImage ? (
             <div className="w-full h-full flex flex-col items-center animate-in fade-in duration-1000">
               <h3 className="text-2xl font-serif text-[#F9F7F2] mb-12 w-full border-b border-white/5 pb-6 text-center tracking-widest">Refined Outcome</h3>
               <div className="flex-1 w-full border-[16px] border-white/5 p-6 bg-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                 <img src={editedImage} alt="Refined Result" className="w-full h-full object-contain" />
               </div>
               <div className="flex gap-8 mt-12">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = editedImage;
                      link.download = 'sovereign-portrait.png';
                      link.click();
                    }}
                    className="px-12 py-4 bg-[#A68966] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B69976] transition-all shadow-xl"
                  >
                    Archive to Dossier
                  </button>
                  <button 
                    onClick={() => setEditedImage(null)}
                    className="px-8 py-4 border border-[#A68966]/40 text-[#A68966] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                  >
                    Discard Iteration
                  </button>
               </div>
             </div>
           ) : (
             <div className="text-center space-y-8 opacity-40">
                <div className="w-32 h-32 border border-[#A68966]/20 rounded-full flex items-center justify-center mx-auto relative">
                   <div className="absolute inset-0 border border-[#A68966]/10 animate-ping rounded-full"></div>
                   <svg className="w-12 h-12 text-[#A68966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
                <p className="text-[#F9F7F2] text-sm font-serif italic max-w-xs mx-auto leading-relaxed tracking-widest">
                  "The neural manifestation of your refinement will appear within this vault upon authorization."
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
