import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import { formatters } from '../../utils/formatters';

interface EditingTransaction extends Transaction {
  isEditing?: boolean;
}

export const StockListTable: React.FC = () => {
  const [transactions, setTransactions] = useState<EditingTransaction[]>([]);
  const [editingData, setEditingData] = useState<Partial<Transaction>>({});

  // 거래 내역 로드
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorage.getItem('transactions');
        if (savedTransactions) {
          const parsed = JSON.parse(savedTransactions);
          const withDates = parsed.map((t: any) => ({
            ...t,
            purchaseDate: new Date(t.purchaseDate),
            isEditing: false
          }));
          setTransactions(withDates);
        }
      } catch (error) {
        console.error('거래 내역 로드 실패:', error);
      }
    };

    loadTransactions();

    // localStorage 변경 감지
    window.addEventListener('storage', loadTransactions);
    return () => window.removeEventListener('storage', loadTransactions);
  }, []);

  // 수정 모드 시작
  const handleEdit = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => ({
        ...t,
        isEditing: t.id === transaction.id
      }))
    );
    setEditingData(transaction);
  };

  // 수정 저장
  const handleSave = (id: string) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id) {
        const updated = {
          ...t,
          ...editingData,
          isEditing: false
        };
        return updated;
      }
      return t;
    });

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
    setEditingData({});
    alert('데이터가 수정되었습니다.');
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setTransactions(prev => prev.map(t => ({ ...t, isEditing: false })));
    setEditingData({});
  };

  // 거래 삭제
  const handleDelete = (id: string) => {
    if (window.confirm('데이터를 삭제하시겠습니까?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">주식 거래 내역</h2>
        <p className="text-gray-500">등록된 거래 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">주식 거래 내역</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              거래일자
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              종목코드
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              거래유형
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              거래수량
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              거래단가
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              거래금액
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              증권사
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map(transaction => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.isEditing ? (
                  <input
                    type="date"
                    value={editingData.purchaseDate?.toISOString().split('T')[0] || 
                           transaction.purchaseDate.toISOString().split('T')[0]}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      purchaseDate: new Date(e.target.value)
                    }))}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  formatters.date.format(transaction.purchaseDate)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {transaction.isEditing ? (
                  <input
                    type="text"
                    value={editingData.ticker || transaction.ticker}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      ticker: e.target.value.toUpperCase()
                    }))}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  transaction.ticker
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.isEditing ? (
                  <select
                    value={editingData.transactionType || transaction.transactionType}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      transactionType: e.target.value as 'BUY' | 'SELL'
                    }))}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="BUY">매수</option>
                    <option value="SELL">매도</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.transactionType === 'BUY' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.transactionType === 'BUY' ? '매수' : '매도'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {transaction.isEditing ? (
                  <input
                    type="number"
                    value={editingData.quantity || transaction.quantity}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      quantity: Number(e.target.value)
                    }))}
                    className="w-full px-2 py-1 border rounded text-right"
                  />
                ) : (
                  formatters.number.format(transaction.quantity)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {transaction.isEditing ? (
                  <input
                    type="number"
                    value={editingData.purchasePrice || transaction.purchasePrice}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      purchasePrice: Number(e.target.value)
                    }))}
                    className="w-full px-2 py-1 border rounded text-right"
                  />
                ) : (
                  formatters.number.formatCurrency(transaction.purchasePrice, transaction.currency)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                {formatters.number.formatCurrency(
                  transaction.quantity * transaction.purchasePrice,
                  transaction.currency
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.isEditing ? (
                  <input
                    type="text"
                    value={editingData.broker || transaction.broker}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      broker: e.target.value
                    }))}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  transaction.broker
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                {transaction.isEditing ? (
                  <>
                    <button
                      onClick={() => handleSave(transaction.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      삭제
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockListTable; 