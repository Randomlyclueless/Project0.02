export type Transaction = {
  date: string;
  amount: number;
  description: string;
};

export type Client = {
  id: string;
  name: string;
  contact: string;
  totalSpent: number;
  lastTransaction: string;
  history: Transaction[];
};
