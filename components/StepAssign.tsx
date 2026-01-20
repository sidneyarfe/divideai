import React, { useState } from 'react';
import { ReceiptItem, Person } from '../types';
import { ChevronRight, Check } from 'lucide-react';

interface StepAssignProps {
  items: ReceiptItem[];
  people: Person[];
  onToggleAssignment: (itemId: string, personId: string) => void;
  onNext: () => void;
}

export const StepAssign: React.FC<StepAssignProps> = ({ 
  items, 
  people, 
  onToggleAssignment,
  onNext
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const activeItem = items.find(i => i.id === selectedItemId);

  const isAssigned = (itemId: string, personId: string) => {
    return items.find(i => i.id === itemId)?.assignedTo.includes(personId);
  };

  // Check if all items are assigned to at least one person
  const isFullyAssigned = items.every(item => item.assignedTo.length > 0);

  return (
    <div className="flex flex-col h-full relative pb-28">
      {/* People Header - Sticky Glass */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-white/20 -mx-6 px-6 py-4 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-center space-x-4 overflow-x-auto no-scrollbar pb-1 min-h-[80px]">
            
            {people.map((person) => (
                <button
                    key={person.id}
                    onClick={() => activeItem && onToggleAssignment(activeItem.id, person.id)}
                    disabled={!activeItem}
                    className={`flex-shrink-0 flex flex-col items-center space-y-2 transition-all duration-300 ${
                        activeItem 
                            ? (isAssigned(activeItem.id, person.id) ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-80 scale-95')
                            : 'opacity-100'
                    }`}
                >
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${person.color} 
                        ${activeItem && isAssigned(activeItem.id, person.id) ? 'ring-4 ring-offset-2 ring-amber-400 shadow-amber-200' : ''} transition-all`}>
                        {person.name.substring(0, 2).toUpperCase()}
                        {activeItem && isAssigned(activeItem.id, person.id) && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[64px] uppercase tracking-wide">{person.name}</span>
                </button>
            ))}
        </div>
        <div className={`mt-2 text-center text-xs font-medium transition-colors duration-300 ${activeItem ? 'text-amber-600' : 'text-slate-400'}`}>
           {activeItem ? "Toque nas pessoas que dividiram" : "Selecione um item abaixo para começar"}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-grow space-y-3 mt-6">
        <div className="flex justify-between items-center px-2">
           <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conta para dividir</span>
           <span className="text-xs text-slate-400">{items.filter(i => i.assignedTo.length > 0).length}/{items.length} atribuídos</span>
        </div>

        {items.map((item) => {
            const isSelected = selectedItemId === item.id;
            const assignedCount = item.assignedTo.length;
            
            return (
                <button
                    key={item.id}
                    onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                    className={`w-full text-left p-4 rounded-3xl transition-all duration-300 relative group ${
                        isSelected 
                            ? 'bg-white/90 shadow-xl scale-[1.02] ring-2 ring-amber-400 z-10' 
                            : assignedCount > 0 
                                ? 'bg-white/60 hover:bg-white/80 shadow-sm border border-white/50' 
                                : 'bg-white/40 hover:bg-white/60 shadow-sm border border-white/50'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="pr-2">
                            <div className="font-semibold text-slate-800 text-lg leading-tight">{item.name}</div>
                            <div className="text-xs mt-1 font-medium">
                                {item.quantity > 1 && <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] mr-2">{item.quantity}x</span>} 
                                <span className={assignedCount === 0 ? "text-amber-600" : "text-green-600"}>
                                    {assignedCount === 0 ? "Toque para atribuir" : assignedCount === 1 ? "1 pessoa" : `${assignedCount} pessoas`}
                                </span>
                            </div>
                        </div>
                        <div className="text-lg font-bold text-slate-800">
                            R$ {item.totalValue.toFixed(2)}
                        </div>
                    </div>

                    {/* Avatars of assigned people */}
                    {item.assignedTo.length > 0 && (
                        <div className="flex -space-x-2 overflow-hidden py-1 pl-1">
                            {item.assignedTo.map((personId) => {
                                const person = people.find(p => p.id === personId);
                                if (!person) return null;
                                return (
                                    <div key={personId} className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${person.color}`} title={person.name} />
                                );
                            })}
                        </div>
                    )}
                </button>
            );
        })}
      </div>
      
       {/* Floating Action Button */}
       <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white/90 via-white/80 to-transparent z-20 safe-area-bottom pointer-events-none backdrop-blur-[2px]">
         <div className="max-w-md mx-auto pointer-events-auto">
            <button
                onClick={onNext}
                disabled={!isFullyAssigned && people.length > 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                    isFullyAssigned && people.length > 0
                        ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-900/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                <span>Ver Resultado</span>
                <ChevronRight className="w-5 h-5" />
            </button>
         </div>
       </div>
    </div>
  );
};