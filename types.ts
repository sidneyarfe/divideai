export interface ReceiptItem {
  id: string;
  name: string;
  totalValue: number;
  quantity: number;
  assignedTo: string[]; // Array of Person IDs
}

export interface Person {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  wantsServiceFee: boolean;
}

export interface ExtractedData {
  estabelecimento: string;
  itens: Array<{
    nome: string;
    valor_total: number;
    quantidade: number;
  }>;
  taxa_servico_original: number;
  total_geral: number;
}

export enum AppStep {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  VERIFY = 'VERIFY',
  PEOPLE = 'PEOPLE',
  ASSIGN = 'ASSIGN',
  RESULT = 'RESULT',
}

export const AVATAR_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
];