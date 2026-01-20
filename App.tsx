import React, { useState } from 'react';
import { StepHome } from './components/StepHome';
import { StepUpload } from './components/StepUpload';
import { StepVerify } from './components/StepVerify';
import { StepPeople } from './components/StepPeople';
import { StepAssign } from './components/StepAssign';
import { StepResult } from './components/StepResult';
import { ReceiptItem, Person, AppStep, ExtractedData, AVATAR_COLORS } from './types';
import { Receipt } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.HOME);
  
  // Data State
  const [establishmentName, setEstablishmentName] = useState('Restaurante');
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [serviceFeePercent, setServiceFeePercent] = useState<number>(10);

  // Timeline definition
  const steps = [
    { id: AppStep.UPLOAD, label: 'Foto', desc: 'Fotografe a conta' },
    { id: AppStep.VERIFY, label: 'Confira', desc: 'Valide os itens e taxas' },
    { id: AppStep.PEOPLE, label: 'Pessoas', desc: 'Quem vai pagar?' },
    { id: AppStep.ASSIGN, label: 'Divisão', desc: 'Quem consumiu o quê?' },
    { id: AppStep.RESULT, label: 'Total', desc: 'Hora de pagar' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const currentStepInfo = steps.find(s => s.id === step);

  // Handlers
  const handleStart = () => {
    setStep(AppStep.UPLOAD);
  };

  const handleDataExtracted = (data: ExtractedData) => {
    setEstablishmentName(data.estabelecimento || 'Local Desconhecido');
    setServiceFeePercent(data.taxa_servico_original || 10);
    
    const formattedItems: ReceiptItem[] = (data.itens || []).map((item, idx) => ({
      id: `item-${idx}-${Date.now()}`,
      name: item.nome,
      quantity: item.quantidade || 1,
      totalValue: item.valor_total,
      assignedTo: []
    }));
    
    setItems(formattedItems);
    setStep(AppStep.VERIFY);
  };

  const handleVerifyConfirm = (verifiedItems: ReceiptItem[], name: string, confirmedServiceFee: number) => {
    setItems(verifiedItems);
    setEstablishmentName(name);
    setServiceFeePercent(confirmedServiceFee);
    
    // Initial "You" person
    const me: Person = {
        id: 'user-me',
        name: 'Você',
        color: AVATAR_COLORS[0],
        wantsServiceFee: true
    };
    setPeople([me]);
    setStep(AppStep.PEOPLE);
  };

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: `p-${Date.now()}`,
      name,
      color: AVATAR_COLORS[people.length % AVATAR_COLORS.length],
      wantsServiceFee: true
    };
    setPeople([...people, newPerson]);
  };

  const handleRemovePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const handleToggleAssignment = (itemId: string, personId: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id !== itemId) return item;
      
      const isAssigned = item.assignedTo.includes(personId);
      let newAssignedTo;
      
      if (isAssigned) {
        newAssignedTo = item.assignedTo.filter(id => id !== personId);
      } else {
        newAssignedTo = [...item.assignedTo, personId];
      }
      
      return { ...item, assignedTo: newAssignedTo };
    }));
  };

  const handleReset = () => {
    setStep(AppStep.HOME);
    setItems([]);
    setPeople([]);
    setEstablishmentName('');
  };

  return (
    <div className="min-h-screen flex justify-center items-start sm:items-center py-0 sm:py-8 font-sans text-slate-900">
      <div className="w-full max-w-md min-h-screen sm:min-h-[85vh] sm:h-[85vh] flex flex-col bg-white/60 backdrop-blur-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/40 ring-1 ring-white/50">
        
        {/* Header - Glass Effect */}
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/20 z-30 transition-all duration-300">
             <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-yellow-300 to-amber-500 p-2 rounded-2xl shadow-lg shadow-amber-500/20">
                        <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">
                        DivideAI
                    </h1>
                </div>
            </div>
            
            {/* Timeline / Progress Bar - Only show if not Home */}
            {step !== AppStep.HOME && currentStepInfo && (
                <div className="px-6 pb-4">
                    <div className="flex items-center space-x-1 mb-2">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full bg-slate-800 rounded-full transition-all duration-500 ${
                                        idx <= currentStepIndex ? 'w-full' : 'w-0'
                                    }`} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Etapa {currentStepIndex + 1} de {steps.length}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 bg-white/50 px-2 py-0.5 rounded-md">
                            {currentStepInfo.desc}
                        </span>
                    </div>
                </div>
            )}
        </header>

        {/* Content Area */}
        <main className="flex-grow px-6 py-4 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="fade-in">
              {step === AppStep.HOME && (
                  <StepHome onStart={handleStart} />
              )}

              {step === AppStep.UPLOAD && (
                  <StepUpload onDataExtracted={handleDataExtracted} />
              )}
              
              {step === AppStep.VERIFY && (
                  <StepVerify 
                      items={items} 
                      establishmentName={establishmentName}
                      initialServiceFee={serviceFeePercent}
                      onConfirm={handleVerifyConfirm} 
                  />
              )}

              {step === AppStep.PEOPLE && (
                  <StepPeople
                      people={people}
                      onAddPerson={handleAddPerson}
                      onRemovePerson={handleRemovePerson}
                      onNext={() => setStep(AppStep.ASSIGN)}
                  />
              )}

              {step === AppStep.ASSIGN && (
                  <StepAssign 
                      items={items} 
                      people={people} 
                      onToggleAssignment={handleToggleAssignment}
                      onNext={() => setStep(AppStep.RESULT)}
                  />
              )}

              {step === AppStep.RESULT && (
                  <StepResult 
                      items={items} 
                      people={people} 
                      defaultServiceFee={serviceFeePercent}
                      onReset={handleReset}
                  />
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;