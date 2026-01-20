import React, { useState } from 'react';
import { ReceiptItem, Person } from '../types';
import { Copy, RotateCcw, Check, X, MessageCircle } from 'lucide-react';

interface StepResultProps {
  items: ReceiptItem[];
  people: Person[];
  defaultServiceFee: number;
  onReset: () => void;
}

export const StepResult: React.FC<StepResultProps> = ({ items, people, defaultServiceFee, onReset }) => {
  const [serviceFeePreferences, setServiceFeePreferences] = useState<Record<string, boolean>>(
    people.reduce((acc, p) => ({ ...acc, [p.id]: p.wantsServiceFee }), {})
  );

  const toggleServiceFee = (personId: string) => {
    setServiceFeePreferences(prev => ({
      ...prev,
      [personId]: !prev[personId]
    }));
  };

  const getPersonItems = (personId: string) => {
    return items.filter(item => item.assignedTo.includes(personId)).map(item => ({
        ...item,
        splitValue: item.totalValue / item.assignedTo.length,
        shareLabel: item.assignedTo.length > 1 ? `(1/${item.assignedTo.length})` : ''
    }));
  };

  const calculatePersonTotal = (personId: string) => {
    const personItems = getPersonItems(personId);
    const subtotal = personItems.reduce((sum, item) => sum + item.splitValue, 0);

    const hasServiceFee = serviceFeePreferences[personId];
    const tip = hasServiceFee ? subtotal * (defaultServiceFee / 100) : 0;

    return {
      subtotal,
      tip,
      total: subtotal + tip,
      personItems
    };
  };

  const generateFullSummary = () => {
    let text = `*Resumo da Conta - DivideAI*\n`;
    text += `------------------------------\n`;
    
    people.forEach(person => {
        const { tip, total, personItems } = calculatePersonTotal(person.id);
        const hasServiceFee = serviceFeePreferences[person.id];

        text += `\n*${person.name}*\n`;
        
        if (personItems.length === 0) {
            text += `   (Nenhum item consumido)\n`;
        } else {
            personItems.forEach(item => {
               text += `   - ${item.name} ${item.shareLabel}: R$ ${item.splitValue.toFixed(2)}\n`; 
            });
        }
        
        if (hasServiceFee && tip > 0) {
             text += `   + Taxa (${defaultServiceFee}%): R$ ${tip.toFixed(2)}\n`;
        }
        
        text += `   *Total: R$ ${total.toFixed(2)}*\n`;
    });
    
    text += `\n------------------------------\n`;
    text += `Gerado por DivideAI`;
    return text;
  };

  const copyToClipboard = () => {
    const text = generateFullSummary();
    navigator.clipboard.writeText(text);
    alert("Resumo completo copiado!");
  };

  const shareToWhatsApp = () => {
    const text = generateFullSummary();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 pb-36">
      <div className="text-center space-y-1 mt-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Total por Pessoa</h2>
        <p className="text-slate-500 font-medium">Deslize para ver detalhes</p>
      </div>

      <div className="grid gap-6">
        {people.map(person => {
          const { subtotal, tip, total, personItems } = calculatePersonTotal(person.id);
          const wantsTip = serviceFeePreferences[person.id];

          return (
            <div key={person.id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/60 overflow-hidden transition-transform hover:scale-[1.01] duration-300">
                {/* Header with Name and Total */}
                <div className="p-5 bg-gradient-to-r from-slate-50/80 to-white/50 border-b border-white/50 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${person.color} shadow-md ring-4 ring-white`}>
                            {person.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800 text-xl tracking-tight">{person.name}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">R$ {total.toFixed(2)}</div>
                    </div>
                </div>

                {/* Detailed Item List */}
                <div className="p-6 space-y-5">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Consumo</h4>
                        {personItems.length === 0 ? (
                            <div className="p-4 bg-slate-50 rounded-xl text-center">
                                <p className="text-sm text-slate-400 font-medium">Nenhum item atribuído</p>
                            </div>
                        ) : (
                            personItems.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex justify-between text-sm items-start py-1">
                                    <div className="flex-1 pr-4">
                                        <span className="text-slate-700 font-medium block">{item.name}</span>
                                        {item.shareLabel && <span className="text-xs text-slate-400 inline-block mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-md font-semibold">{item.shareLabel}</span>}
                                    </div>
                                    <span className="font-semibold text-slate-600 whitespace-nowrap">R$ {item.splitValue.toFixed(2)}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-slate-100/80"></div>

                    {/* Subtotals and Service Fee Toggle */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium text-slate-500 px-1">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="bg-white/60 p-1.5 rounded-2xl border border-white/50 shadow-inner">
                            <div className="flex items-center justify-between p-3 pb-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Taxa de Serviço</span>
                                    <span className="font-bold text-slate-700">{defaultServiceFee}%</span>
                                </div>
                                <span className={`font-bold text-lg ${wantsTip ? 'text-slate-900' : 'text-slate-300 line-through'}`}>
                                    R$ {tip.toFixed(2)}
                                </span>
                            </div>
                            
                            {/* iOS Style Toggle Switch - Fixed Layout */}
                            <button
                                onClick={() => toggleServiceFee(person.id)}
                                className={`w-full relative h-12 rounded-xl transition-all duration-300 flex items-center px-1 border overflow-hidden ${
                                    wantsTip ? 'bg-green-50/50 border-green-100' : 'bg-slate-100/50 border-slate-200/50'
                                }`}
                            >
                                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wide z-0">
                                    <span className={`flex-1 text-center transition-all duration-300 ${wantsTip ? 'opacity-100 text-green-700 scale-100' : 'opacity-0 scale-95'}`}>
                                        Com Taxa
                                    </span>
                                    <span className={`flex-1 text-center transition-all duration-300 ${!wantsTip ? 'opacity-100 text-slate-500 scale-100' : 'opacity-0 scale-95'}`}>
                                        Sem Taxa
                                    </span>
                                </div>
                                
                                <div className={`relative z-10 h-10 w-1/2 rounded-lg shadow-sm flex items-center justify-center font-bold text-sm transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 transform ${
                                    wantsTip 
                                        ? 'translate-x-[calc(100%-4px)] bg-white text-green-600 shadow-green-100' 
                                        : 'translate-x-0 bg-white text-slate-400'
                                }`}>
                                    {wantsTip ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-2xl border-t border-white/40 z-20 safe-area-bottom">
         <div className="max-w-md mx-auto flex flex-col gap-3">
             <button 
                onClick={shareToWhatsApp}
                className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3.5 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
            >
                <MessageCircle className="w-5 h-5" />
                <span>Compartilhar no whatsapp</span>
            </button>
             
             <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center space-x-2 bg-slate-100/80 backdrop-blur-md text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                    <Copy className="w-5 h-5" />
                    <span>Copiar</span>
                </button>
                <button 
                    onClick={onReset}
                    className="flex items-center justify-center space-x-2 bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Novo</span>
                </button>
             </div>
         </div>
      </div>
    </div>
  );
};