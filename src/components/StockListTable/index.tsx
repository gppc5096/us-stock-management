import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface StockTransaction {
  id: string;
  ticker: string;
  broker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currency: 'USD' | 'KRW';
  transactionType: 'BUY' | 'SELL';
}

interface SortConfig {
  key: keyof StockTransaction;
  direction: 'asc' | 'desc';
}

export const StockListTable: React.FC = () => {
  const [transactions] = useLocalStorage<StockTransaction[]>('stock-transactions', []);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'purchaseDate', direction: 'desc' });
  const [filterText, setFilterText] = useState('');

  // 정렬 함수
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  // 필터링 함수
  const filteredTransactions = sortedTransactions.filter(transaction => 
    transaction.ticker.toLowerCase().includes(filterText.toLowerCase()) ||
    transaction.broker.toLowerCase().includes(filterText.toLowerCase())
  );

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // 정렬 핸들러
  const handleSort = (key: keyof StockTransaction) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="overflow-x-auto">
      {/* 검색 필터 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="종목코드 또는 증권사로 검색..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="px-4 py-2 border rounded-md w-full max-w-xs"
        />
      </div>

      {/* 거래 목록 테이블 */}
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th 
              onClick={() => handleSort('purchaseDate')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              날짜 {sortConfig.key === 'purchaseDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('ticker')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              종목코드 {sortConfig.key === 'ticker' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('transactionType')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              거래유형 {sortConfig.key === 'transactionType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('quantity')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              수량 {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('purchasePrice')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              가격 {sortConfig.key === 'purchasePrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('broker')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              증권사 {sortConfig.key === 'broker' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(transaction.purchaseDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.ticker}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transaction.transactionType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.transactionType === 'BUY' ? '매수' : '매도'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.purchasePrice.toLocaleString()} {transaction.currency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.broker}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === i + 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  );
};

export default StockListTable; 