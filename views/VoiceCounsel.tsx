
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceCounsel: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [currentPartials, setCurrentPartials] = useState<{ user: string; model: string }>({ user: '', model: '' });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const partialsRef = useRef({ user: '', model: '' });

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history, currentPartials]);

  const stopSession = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    for (const source of sourcesRef.current) {
      try { source.stop(); } catch(e) {}
    }
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setCurrentPartials({ user: '', model: '' });
    partialsRef.current = { user: '', model: '' };
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outAudioContextRef.current) {
      outAudioContextRef.current.close();
      outAudioContextRef.current = null;
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      await audioContext.resume();
      await outAudioContext.resume();
      
      audioContextRef.current = audioContext;
      outAudioContextRef.current = outAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch(() => {});
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              partialsRef.current.model += text;
              setCurrentPartials({ ...partialsRef.current });
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              partialsRef.current.user += text;
              setCurrentPartials({ ...partialsRef.current });
            }

            if (message.serverContent?.turnComplete) {
              const finalUser = partialsRef.current.user.trim();
              const finalModel = partialsRef.current.model.trim();
              
              if (finalUser || finalModel) {
                setHistory(prev => [
                  ...prev, 
                  ...(finalUser ? [{ role: 'user' as const, text: finalUser }] : []),
                  ...(finalModel ? [{ role: 'model' as const, text: finalModel }] : [])
                ]);
              }
              
              partialsRef.current = { user: '', model: '' };
              setCurrentPartials({ user: '', model: '' });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = outAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = outAudioContextRef.current?.currentTime || 0;
            }
          },
          onerror: (e: any) => {
            console.error('Consular Link Error:', e);
            if (e?.message?.includes("Requested entity was not found")) {
              window.location.hash = '#/reauthorize';
            }
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
          systemInstruction: 'You are the Elite Consular AI for the Sovereign Bureau. You specialize in O1 and EB1A US visa strategy. Maintain a formal, American high-society tone. Your purpose is to provide high-level strategic counsel based on current US legal standards.',
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Neural Link Handshake Failure:', err);
      if (err?.message?.includes("Requested entity was not found")) {
        window.location.hash = '#/reauthorize';
      }
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 lg:space-y-8 animate-in fade-in duration-1000">
      <div className="flex justify-between items-baseline border-b border-[#A68966]/20 pb-4 shrink-0">
        <div>
          <h2 className="text-2xl lg:text-4xl font-serif text-[#141E30]">Consular Chambers</h2>
          <p className="text-[10px] lg:text-sm text-[#8C8C8C] font-medium tracking-wide mt-1 uppercase">Direct Vocal Strategic Counsel</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 min-h-0 overflow-hidden">
        <div className="bg-white p-6 lg:p-12 border border-[#A68966]/30 shadow-sm flex flex-col items-center justify-center space-y-6 lg:space-y-10 relative overflow-y-auto custom-scrollbar h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A68966]/20 to-transparent"></div>
          
          <div className="relative group shrink-0">
            <div className={`w-28 h-28 lg:w-48 lg:h-48 rounded-full border border-[#A68966]/20 flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-105 border-[#1B3022]' : ''}`}>
              <div className={`w-20 h-20 lg:w-40 lg:h-40 rounded-full border border-[#A68966]/10 flex items-center justify-center transition-all duration-500 bg-[#F9F7F2] relative overflow-hidden shadow-inner`}>
                {isActive && (
                  <div className="absolute inset-0 bg-[#1B3022]/5 animate-pulse"></div>
                )}
                <svg className={`w-8 h-8 lg:w-16 lg:h-16 z-10 transition-colors ${isActive ? 'text-[#1B3022]' : 'text-[#A68966]/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-32 h-32 lg:w-64 lg:h-64 rounded-full border border-[#1B3022]/10 animate-ping duration-[3000ms]"></div>
              </div>
            )}
          </div>

          <div className="text-center space-y-2 lg:space-y-4 shrink-0">
            <h3 className="text-lg lg:text-xl font-serif text-[#141E30]">
              {isActive ? 'Neural Link Active' : isConnecting ? 'Establishing Link...' : 'Protocol Ready'}
            </h3>
            <p className="text-[9px] lg:text-xs text-[#8C8C8C] font-bold uppercase tracking-[0.2em] max-w-[200px] lg:max-w-xs mx-auto leading-relaxed">
              {isActive 
                ? 'The Bureau is listening. State your inquiry.' 
                : 'Authorize the Consular Link to engage in vocal analysis.'}
            </p>
          </div>

          <button 
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`w-full max-w-sm py-4 lg:py-5 font-bold text-[9px] lg:text-[10px] uppercase tracking-[0.4em] transition-all duration-500 shadow-xl shrink-0 ${
              isActive 
                ? 'bg-[#141E30] text-[#A68966] border border-[#A68966] hover:bg-black' 
                : 'bg-[#141E30] text-[#F9F7F2] hover:bg-[#1B3022]'
            } disabled:opacity-50 flex items-center justify-center gap-3`}
          >
            {isConnecting && <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>}
            {isConnecting ? 'Establishing...' : isActive ? 'Terminate Protocol' : 'Initiate Handshake'}
          </button>
        </div>

        <div className="bg-[#141E30] p-6 lg:p-8 border border-[#A68966]/20 flex flex-col h-full min-h-[300px] shadow-2xl overflow-hidden">
           <div className="flex justify-between items-center mb-4 lg:mb-6 border-b border-white/5 pb-3 shrink-0">
              <h3 className="text-sm lg:text-lg font-serif text-[#F9F7F2] uppercase tracking-[0.1em]">Protocol Ledger</h3>
              <span className="text-[8px] text-[#A68966] font-bold tracking-[0.2em] uppercase">Private Encryption</span>
           </div>
           
           <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {history.length === 0 && !currentPartials.user && !currentPartials.model ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                  <div className="w-12 h-px bg-white/20"></div>
                  <p className="text-[8px] lg:text-xs text-[#F9F7F2] font-bold uppercase tracking-[0.2em]">Archive Empty</p>
                  <div className="w-12 h-px bg-white/20"></div>
                </div>
              ) : (
                <>
                  {history.map((t, i) => (
                    <div key={i} className={`space-y-1 lg:space-y-2 animate-in fade-in duration-500 border-l-2 pl-4 ${t.role === 'user' ? 'border-slate-700' : 'border-[#A68966]/40'}`}>
                      <p className={`text-[8px] lg:text-[10px] font-bold uppercase tracking-widest ${t.role === 'user' ? 'text-slate-400' : 'text-[#A68966]'}`}>
                        {t.role === 'user' ? 'Subject' : 'Consular Analysis'}
                      </p>
                      <p className={`text-xs lg:text-sm leading-relaxed ${t.role === 'user' ? 'text-white' : 'text-[#F9F7F2] font-serif italic'}`}>
                        {t.text}
                      </p>
                    </div>
                  ))}
                  
                  {currentPartials.user && (
                    <div className="space-y-1 lg:space-y-2 border-l-2 pl-4 border-slate-700/30 opacity-60">
                      <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject (Processing...)</p>
                      <p className="text-xs lg:text-sm leading-relaxed text-white italic">{currentPartials.user}</p>
                    </div>
                  )}
                  {currentPartials.model && (
                    <div className="space-y-1 lg:space-y-2 border-l-2 pl-4 border-[#A68966]/20 opacity-60">
                      <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#A68966]">Counsel (Processing...)</p>
                      <p className="text-xs lg:text-sm leading-relaxed text-[#F9F7F2] font-serif italic">{currentPartials.model}</p>
                    </div>
                  )}
                </>
              )}
           </div>
           
           <div className="mt-4 pt-4 border-t border-white/5 text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] flex justify-between items-center shrink-0">
              <span>Link ID: SOV-NRL-8821</span>
              <div className="flex gap-1.5">
                <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse delay-75' : 'bg-slate-700'}`}></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCounsel;
