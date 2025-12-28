import React, { useState, useEffect } from 'react';
import { Share2, Download, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

interface RoastData {
  roast: string;
  meme_caption: string;
  visual_description: string;
  burnout_score: number;
  // This is the new field for the "Fix My Life" feature
  fixed_schedule?: { time: string; activity: string }[];
}

export default function RoastResult({ data, onReset }: { data: RoastData; onReset: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showFix, setShowFix] = useState(false);

  // 1. DETERMINE THE GIF BASED ON SCORE
  const getReactionGif = (score: number) => {
    // 80-100%: Elmo on Fire (Total Chaos)
    if (score >= 80) return "https://media.giphy.com/media/P7JmDW7IkB7TW/giphy.gif"; 
    
    // 40-79%: This is Fine Dog (Denial)
    if (score >= 40) return "https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif"; 
    
    // 0-39%: Vibing Cat (Safe)
    return "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif"; 
  };

  const reactionGif = getReactionGif(data.burnout_score);

  // 2. THE VOICE OF JUDGMENT LOGIC
  useEffect(() => {
    if (!muted) {
      speakRoast();
    }
    // Cleanup on unmount
    return () => window.speechSynthesis.cancel();
  }, [data]);

  // 🎉 CONFETTI EFFECT
  useEffect(() => {

    // Only fire confetti if the burnout score is high (optional logic, or just always fire)
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#facc15', '#000000'] // Vibe colors (Purple, Yellow, Black)
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#facc15', '#000000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const speakRoast = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.roast);
    const voices = window.speechSynthesis.getVoices();
    // Try to find a specific sassy voice
    const sassVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha'));
    if (sassVoice) utterance.voice = sassVoice;
    
    utterance.pitch = 0.9; 
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = document.getElementById('roast-capture-area');
    
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true // Attempt to capture the GIF/Image
        });
        const link = document.createElement('a');
        link.download = `meme-ify-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Screenshot failed:", err);
        alert("Download failed. Your vibe was too powerful.");
      }
    }
    setIsDownloading(false);
  };

  const scoreColor = data.burnout_score > 80 ? 'bg-red-500' : data.burnout_score > 50 ? 'bg-vibe-yellow' : 'bg-green-400';

  return (
    <div className="w-full max-w-2xl animate-shake relative pb-20">
      
      {/* Sound Toggle Button */}
      <button 
        onClick={() => { if (muted) speakRoast(); setMuted(!muted); }}
        className="absolute -top-12 right-0 bg-white border-2 border-black p-2 shadow-neo-sm hover:shadow-none transition-all rounded-full z-10"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* === CAPTURE ZONE START (Everything inside here gets downloaded) === */}
      <div id="roast-capture-area" className="bg-white p-6 border-4 border-black shadow-neo mb-6 relative overflow-hidden">
        
        {/* Header: Score + GIF */}
        <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
          <div className="flex-1">
            <div className="font-black text-xl mb-2">TRAUMA LEVEL: {data.burnout_score}%</div>
            <div className="w-full h-6 border-2 border-black bg-gray-200 relative max-w-[200px]">
              <div className={`h-full ${scoreColor}`} style={{ width: `${data.burnout_score}%` }} />
            </div>
          </div>
          
          {/* Reaction GIF Box */}
          <div className="w-24 h-24 border-2 border-black shadow-neo-sm -mb-8 mr-2 bg-gray-200 z-10 relative">
            <img 
              src={reactionGif} 
              alt="Reaction" 
              className="w-full h-full object-cover" 
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* The Main Roast Card */}
        <div className="bg-vibe-purple border-4 border-black p-8 text-white transform rotate-1 mt-8">
          <h2 className="text-3xl font-black italic mb-4 leading-tight">" {data.meme_caption} "</h2>
          <p className="font-mono text-lg border-t-2 border-white pt-4 opacity-90">
            {data.roast}
          </p>
        </div>
        
        <div className="text-right mt-4 text-xs font-bold text-gray-400">
          GENERATED BY MEME-IFY MY DAY
        </div>
      </div>
      {/* === CAPTURE ZONE END === */}


      {/* 3. THE "FIX MY LIFE" FEATURE (Outside capture zone) */}
      <div className="mb-6">
        {!showFix ? (
          <button 
            onClick={() => setShowFix(true)}
            className="w-full bg-vibe-black text-vibe-yellow border-4 border-vibe-yellow p-4 font-black text-xl hover:bg-vibe-yellow hover:text-black transition-colors shadow-neo animate-pulse flex items-center justify-center gap-2"
          >
            <Sparkles /> EMERGENCY: FIX MY LIFE
          </button>
        ) : (
          <div className="bg-vibe-black text-white border-4 border-vibe-yellow p-6 shadow-neo transform -rotate-1">
            <h3 className="text-vibe-yellow font-black text-2xl mb-4 text-center uppercase border-b-2 border-white/20 pb-2">
              ✨ OPTIMIZED SCHEDULE
            </h3>
            <ul className="space-y-4 font-mono text-lg">
              {data.fixed_schedule && data.fixed_schedule.length > 0 ? (
                data.fixed_schedule.map((item, i) => (
                  <li key={i} className="flex gap-4 items-center">
                    <span className="bg-vibe-purple px-2 py-1 text-sm font-bold border border-white transform -rotate-2 shrink-0">
                      {item.time}
                    </span>
                    <span>{item.activity}</span>
                  </li>
                ))
              ) : (
                <li className="text-center italic text-gray-400">
                  (AI was too lazy to fix your schedule. Just go back to bed.)
                </li>
              )}
            </ul>
            <button 
              onClick={() => setShowFix(false)}
              className="w-full mt-6 text-xs text-gray-500 hover:text-white underline"
            >
              Close and return to misery
            </button>
          </div>
        )}
      </div>

      {/* 4. Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={() => { window.speechSynthesis.cancel(); onReset(); }}
          className="flex-1 bg-white border-2 border-black p-4 font-bold hover:bg-gray-100 shadow-neo hover:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} /> TRY AGAIN
        </button>
        
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-vibe-yellow border-2 border-black p-4 font-bold shadow-neo hover:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <span>SAVING...</span>
          ) : (
            <>
              <Download size={20} /> DOWNLOAD MEME
            </>
          )}
        </button>
      </div>
    </div>
  );
}