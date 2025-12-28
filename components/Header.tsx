import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 border-b-4 border-black bg-vibe-white">
      <div className="flex items-center gap-2">
        <div className="bg-vibe-purple p-2 border-2 border-black shadow-neo-sm transform -rotate-2">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          Meme-ify My Day
        </h1>
      </div>
      <div className="hidden md:block">
        <span className="font-bold bg-vibe-yellow px-3 py-1 border-2 border-black shadow-neo-sm text-sm">
          v1.0 (Chaos Mode)
        </span>
      </div>
    </header>
  );
}