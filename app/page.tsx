"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import DragDropZone from '@/components/DragDropZone';
import RoastResult from '@/components/RoastResult'; 

// Define the shape of the data we expect from the API
interface RoastData {
  roast: string;
  meme_caption: string;
  visual_description: string;
  burnout_score: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [loadingText, setLoadingText] = useState("Initializing judgment...");

  // Helper: Convert file to Base64 so we can send it to the API
  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    setRoastData(null);

    // Funny loading messages cycle
    const messages = [
      "Analyzing poor life choices...",
      "Calculating caffeine dependency...",
      "Consulting the meme oracle...",
      "Judging your font usage...",
      "Laughing at your schedule..."
    ];
    
    // Change text every 1.5s while waiting
    const msgInterval = setInterval(() => {
       setLoadingText(messages[Math.floor(Math.random() * messages.length)]);
    }, 1500);

    try {
      // 1. Convert image to format AI understands
      const base64Image = await toBase64(selectedFile);
      
      // 2. Send to our "Brain" (API)
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error("Roast failed");
      
      // 3. Get the funny data back
      const data = await response.json();
      setRoastData(data);

    } catch (error) {
      console.error(error);
      alert("Something went wrong. The AI refused to roast you (probably out of pity).");
      setFile(null); 
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRoastData(null);
  };

  return (
    <main className="min-h-screen flex flex-col font-mono text-vibe-black">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-8">
        
        {/* 1. HERO & INTRO (Only show if no result yet) */}
        {!roastData && !loading && (
          <div className="text-center space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-vibe-purple drop-shadow-sm">
              DO YOU DARE?
            </h2>
            <p className="text-xl font-bold bg-white inline-block px-4 py-2 border-2 border-black shadow-neo-sm transform -rotate-1">
              Let AI judge your chaotic schedule.
            </p>
          </div>
        )}

        {/* 2. UPLOAD ZONE (Hidden if loading or result showing) */}
        {!loading && !roastData && (
           <div className="w-full max-w-xl animate-shake">
            <DragDropZone 
              onFileSelect={handleFileSelect} 
              isUploading={loading} 
            />
          </div>
        )}

        {/* 3. LOADING STATE (Funny text) */}
        {loading && (
          <div className="text-center p-12 border-4 border-black bg-white shadow-neo animate-pulse">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-black">{loadingText}</h2>
          </div>
        )}

        {/* 4. RESULT DISPLAY (The Roast) */}
        {roastData && (
          <RoastResult data={roastData} onReset={handleReset} />
        )}

      </div>
    </main>
  );
}