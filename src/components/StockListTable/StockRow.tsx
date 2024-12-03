import React, { memo } from 'react';
import { formatters } from '../../utils/formatters';

interface StockRowProps {
  transaction: {
    id: string;
    ticker: string;
    broker: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: Date;
    transactionType: 'BUY' | 'SELL';
  };
  onDelete: (id: string) => void;
}

export const StockRow = memo(({ transaction, onDelete }: StockRowProps) => {
  const { ticker, broker, quantity, purchasePrice, purchaseDate, transactionType } = transaction;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">{ticker}</td>
      <td className="px-6 py-4 whitespace-nowrap">{broker}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {formatters.number.format(quantity)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {formatters.number.formatCurrency(purchasePrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formatters.date.format(purchaseDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          transactionType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {transactionType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  return prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.quantity === nextProps.transaction.quantity &&
    prevProps.transaction.purchasePrice === nextProps.transaction.purchasePrice;
}); 