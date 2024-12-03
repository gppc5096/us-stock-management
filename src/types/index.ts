export interface Transaction {
  id: string;
  ticker: string;
  broker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  transactionType: 'BUY' | 'SELL';
  currency: 'USD' | 'KRW';
}

export interface StockTransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
} 