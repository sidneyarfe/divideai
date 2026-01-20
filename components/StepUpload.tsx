import React, { useState } from 'react';
import { Camera, Upload, Loader2, AlertCircle, ScanLine } from 'lucide-react';
import { processReceiptImage } from '../services/geminiService';
import { ExtractedData } from '../types';

interface StepUploadProps {
  onDataExtracted: (data: ExtractedData) => void;
}

export const StepUpload: React.FC<StepUploadProps> = ({ onDataExtracted }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const data = await processReceiptImage(base64String);
        onDataExtracted(data);
      } catch (err) {
        setError("Não foi possível analisar a conta. Tente novamente com uma foto mais clara.");
        console.error(err);
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 p-2 text-center">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-[2rem] mx-auto shadow-2xl shadow-amber-500/30 flex items-center justify-center transform rotate-3">
             <ScanLine className="w-12 h-12 text-white" />
        </div>
        <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Escanear Conta</h2>
            <p className="text-slate-500 text-lg mt-2 leading-relaxed">
            Converta sua notinha em dados <br/> em segundos.
            </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center space-y-6 animate-pulse bg-white/50 p-8 rounded-3xl backdrop-blur-md border border-white/40 shadow-lg w-full max-w-sm">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <div className="space-y-2">
            <p className="text-slate-800 font-semibold">Analisando com IA...</p>
            <p className="text-xs text-slate-400">Isso pode levar alguns segundos</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xs space-y-5">
          <label className="flex items-center justify-center w-full p-5 bg-slate-900 text-white rounded-2xl cursor-pointer shadow-xl shadow-slate-900/20 active:scale-95 transition-all duration-200 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <Camera className="w-6 h-6" />
              <span className="font-semibold text-lg">Tirar Foto</span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
          
          <label className="flex items-center justify-center w-full p-5 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl cursor-pointer shadow-lg active:scale-95 transition-all duration-200 hover:bg-white/90 text-slate-700">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5" />
              <span className="font-semibold text-lg">Carregar da Galeria</span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 text-red-600 bg-red-50/80 backdrop-blur-md p-4 rounded-2xl border border-red-100 text-left text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};