"use client"; // This component needs interactivity

import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

// We define props so we can pass data back to the parent page later
interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export default function DragDropZone({ onFileSelect, isUploading }: DragDropZoneProps) {
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`
        relative border-4 border-dashed border-black bg-white 
        p-12 text-center cursor-pointer transition-all duration-200
        hover:bg-vibe-pink/10 hover:border-vibe-pink hover:scale-[1.01] hover:shadow-neo
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="bg-vibe-blue p-4 rounded-full border-2 border-black shadow-neo">
          <UploadCloud className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Drag your calendar misery here</h3>
          <p className="text-sm text-gray-600 mt-1">or click to browse screenshots</p>
        </div>
      </div>
    </div>
  );
}