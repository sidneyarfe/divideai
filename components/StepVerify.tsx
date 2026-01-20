import React, { useState, useEffect } from 'react';
import { ReceiptItem } from '../types';
import { Plus, Trash2, CheckCircle, Percent, Utensils, DollarSign } from 'lucide-react';

interface StepVerifyProps {
  items: ReceiptItem[];
  establishmentName: string;
  initialServiceFee: number;
  onConfirm: (items: ReceiptItem[], name: string, serviceFee: number) => void;
}

export const StepVerify: React.FC<StepVerifyProps> = ({ 
  items: initialItems, 
  establishmentName: initialName, 
  initialServiceFee,
  onConfirm 
}) => {
  const [items, setItems] = useState<ReceiptItem[]>(initialItems);
  const [name, setName] = useState(initialName);
  
  // Service Fee State
  const [feeMode, setFeeMode] = useState<'percent' | 'fixed'>('percent');
  const [feeValue, setFeeValue] = useState<string>(initialServiceFee.toString());

  const handleUpdateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = (isCouvert = false) => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      name: isCouvert ? "Couvert / Extra" : "Novo Item",
      quantity: 1,
      totalValue: 0,
      assignedTo: []
    };
    setItems([...items, newItem]);
  };

  const itemsTotal = items.reduce((sum, item) => sum + Number(item.totalValue), 0);
  
  // Calculate display values based on mode
  const getCalculatedFee = () => {
    const val = parseFloat(feeValue) || 0;
    if (feeMode === 'percent') {
      return itemsTotal * (val / 100);
    } else {
      return val;
    }
  };

  const currentFeeAmount = getCalculatedFee();
  const grandTotal = itemsTotal + currentFeeAmount;

  const handleConfirm = () => {
    // If user entered a fixed value, we convert it to an effective percentage
    // so the rest of the app (which relies on splitting proportionate to consumption) works correctly.
    let effectivePercent = 0;
    const val = parseFloat(feeValue) || 0;

    if (feeMode === 'percent') {
        effectivePercent = val;
    } else {
        // Avoid division by zero
        if (itemsTotal > 0) {
            effectivePercent = (val / itemsTotal) * 100;
        } else {
            effectivePercent = 0;
        }
    }

    onConfirm(items, name, effectivePercent);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-4">Estabelecimento</label>
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-1">
            <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent outline-none p-4 text-slate-800 placeholder-slate-400"
            placeholder="Nome do local"
            />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center ml-4 mr-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Itens</label>
          <span className="text-xs font-medium text-slate-400 bg-slate-100/50 px-2 py-1 rounded-full">{items.length}</span>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-sm overflow-hidden">
          {items.map((item, index) => (
            <div key={item.id} className={`flex gap-3 items-start p-4 hover:bg-white/50 transition-colors ${index !== items.length - 1 ? 'border-b border-slate-100/80' : ''}`}>
              <div className="w-10 pt-1">
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                  className="w-full text-center bg-slate-100/80 rounded-lg py-1.5 font-semibold text-slate-700 text-sm focus:bg-white focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                />
              </div>
              <div className="flex-grow pt-1">
                <textarea 
                  value={item.name}
                  onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-800 outline-none placeholder-slate-300 resize-none leading-relaxed"
                  placeholder="Nome do item"
                  rows={2}
                />
              </div>
              <div className="w-20 relative pt-1">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium sr-only">R$</span>
                <div className="relative">
                     <span className="absolute left-0 top-2 text-slate-400 text-xs font-medium">R$</span>
                    <input 
                    type="number" 
                    value={item.totalValue}
                    onChange={(e) => handleUpdateItem(item.id, 'totalValue', Number(e.target.value))}
                    className="w-full text-right bg-transparent font-bold text-slate-800 outline-none"
                    step="0.01"
                    />
                </div>
              </div>
              <button 
                onClick={() => handleDeleteItem(item.id)}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full p-2 mt-0.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button 
            onClick={() => handleAddItem(false)}
            className="flex items-center justify-center space-x-2 py-3 bg-white/40 border border-white/60 rounded-2xl text-slate-600 hover:bg-white/60 active:scale-95 transition-all shadow-sm backdrop-blur-md"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Item</span>
          </button>
          <button 
            onClick={() => handleAddItem(true)}
            className="flex items-center justify-center space-x-2 py-3 bg-white/40 border border-white/60 rounded-2xl text-slate-600 hover:bg-white/60 active:scale-95 transition-all shadow-sm backdrop-blur-md"
          >
            <Utensils className="w-4 h-4" />
            <span className="font-medium">Couvert</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-4">Taxa de Serviço</label>
        <div className="bg-amber-50/80 backdrop-blur-xl p-4 rounded-3xl border border-amber-100/50 shadow-sm space-y-4">
            
            {/* iOS Segmented Control */}
            <div className="flex p-1 bg-amber-100/50 rounded-xl relative">
                <div className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${feeMode === 'percent' ? 'left-1' : 'left-[51%]'}`}></div>
                <button 
                    onClick={() => setFeeMode('percent')}
                    className={`flex-1 relative z-10 py-1.5 text-sm font-semibold transition-colors ${feeMode === 'percent' ? 'text-amber-700' : 'text-slate-500'}`}
                >
                    Porcentagem (%)
                </button>
                <button 
                    onClick={() => setFeeMode('fixed')}
                    className={`flex-1 relative z-10 py-1.5 text-sm font-semibold transition-colors ${feeMode === 'fixed' ? 'text-amber-700' : 'text-slate-500'}`}
                >
                    Valor Fixo (R$)
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-amber-100 p-2 rounded-xl">
                        {feeMode === 'percent' ? (
                            <Percent className="w-4 h-4 text-amber-600" />
                        ) : (
                            <DollarSign className="w-4 h-4 text-amber-600" />
                        )}
                    </div>
                    <span className="font-semibold text-slate-800">
                        {feeMode === 'percent' ? 'Valor da Porcentagem' : 'Valor Total da Taxa'}
                    </span>
                </div>
                <div className="w-24 bg-white/80 rounded-xl px-2 py-1 shadow-inner flex items-center">
                    {feeMode === 'fixed' && <span className="text-slate-400 text-sm font-bold mr-1">R$</span>}
                    <input 
                        type="number" 
                        value={feeValue}
                        onChange={(e) => setFeeValue(e.target.value)}
                        className="w-full text-right bg-transparent font-bold text-slate-800 outline-none p-1"
                        placeholder="0"
                    />
                    {feeMode === 'percent' && <span className="text-slate-400 text-sm font-bold ml-1">%</span>}
                </div>
            </div>

            {/* Helper text showing calculation */}
            <div className="text-right text-xs font-medium text-amber-700/60 px-1">
                {feeMode === 'percent' 
                    ? `Total da taxa: R$ ${currentFeeAmount.toFixed(2)}`
                    : `Equivalente a ${(itemsTotal > 0 ? (currentFeeAmount / itemsTotal * 100) : 0).toFixed(1)}%`
                }
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-2xl border-t border-white/40 z-20 safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Estimado</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">R$ {grandTotal.toFixed(2)}</span>
            </div>
            <button 
            onClick={handleConfirm}
            className="flex-1 bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2 hover:bg-slate-800"
            >
            <span>Continuar</span>
            <CheckCircle className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};