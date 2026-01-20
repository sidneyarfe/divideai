import React from 'react';
import { ChevronRight, Receipt, Users, Calculator, Zap } from 'lucide-react';

interface StepHomeProps {
  onStart: () => void;
}

export const StepHome: React.FC<StepHomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col h-full relative pb-10 pt-4">
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 text-center px-2">
        
        {/* Hero Icon */}
        <div className="relative">
            <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-20 rounded-full"></div>
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-500/30 transform rotate-6 relative z-10 ring-4 ring-white/40">
                <Receipt className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/50 transform -rotate-6 z-20">
                <Calculator className="w-8 h-8 text-slate-700" />
            </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-4 max-w-xs mx-auto">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
                Contas em grupo <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">sem atrito.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Escaneie o recibo, selecione os amigos e deixe a IA calcular quem paga o quê.
            </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4 w-full">
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center space-x-4 shadow-sm">
                <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                    <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-800">Rápido</h3>
                    <p className="text-xs text-slate-500">Leitura automática com IA</p>
                </div>
            </div>
            
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center space-x-4 shadow-sm">
                <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                    <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-800">Justo</h3>
                    <p className="text-xs text-slate-500">Cada um paga o que consumiu</p>
                </div>
            </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="w-full mt-auto pt-8">
        <button 
            onClick={onStart}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold text-xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-3 hover:bg-slate-800 group"
        >
            <span>Começar Agora</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};