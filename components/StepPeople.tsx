import React, { useState } from 'react';
import { Person } from '../types';
import { Plus, User, Trash2, ArrowRight } from 'lucide-react';

interface StepPeopleProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (id: string) => void;
  onNext: () => void;
}

export const StepPeople: React.FC<StepPeopleProps> = ({ people, onAddPerson, onRemovePerson, onNext }) => {
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onAddPerson(nameInput.trim());
      setNameInput('');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 pb-32">
      <div className="space-y-2 text-center mt-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quem vai pagar?</h2>
        <p className="text-slate-500">Adicione todos que vão dividir a conta</p>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Nome da pessoa"
            className="w-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl py-4 pl-12 pr-14 text-lg font-semibold text-slate-800 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
            autoFocus
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <User className="w-5 h-5" />
        </div>
        <button 
            type="submit"
            disabled={!nameInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
        >
            <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* People List - iOS Grouped Style */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-4">Na Mesa ({people.length})</label>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-sm overflow-hidden">
            {people.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <p>Adicione pessoas acima</p>
                </div>
            ) : (
                people.map((person, index) => (
                    <div key={person.id} className={`flex items-center justify-between p-4 hover:bg-white/50 transition-colors ${index !== people.length - 1 ? 'border-b border-slate-100/80' : ''}`}>
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${person.color} shadow-sm`}>
                                {person.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800 text-lg">{person.name}</span>
                            {person.id === 'user-me' && (
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Você</span>
                            )}
                        </div>
                        
                        {person.id !== 'user-me' && (
                            <button 
                                onClick={() => onRemovePerson(person.id)}
                                className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-2xl border-t border-white/40 z-20 safe-area-bottom">
        <div className="max-w-md mx-auto">
            <button 
            onClick={onNext}
            className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2 hover:bg-slate-800"
            >
            <span>Ir para Divisão</span>
            <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};