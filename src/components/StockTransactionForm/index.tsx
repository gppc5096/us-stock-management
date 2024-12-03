import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types/index';
import { Broker } from '../../types/broker';
import { brokerService } from '../../services/brokerService';

interface StockTransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
}

export const StockTransactionForm: React.FC<StockTransactionFormProps> = ({ onSubmit }) => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [formData, setFormData] = useState({
    ticker: '',
    brokerId: '',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    type: 'BUY'
  });

  useEffect(() => {
    setBrokers(brokerService.getActiveBrokers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const broker = brokers.find(b => b.id === formData.brokerId);
    if (!broker) return;

    const quantity = Number(formData.quantity.replace(/,/g, ''));
    const price = Number(formData.price.replace(/,/g, ''));

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      ticker: formData.ticker.toUpperCase(),
      broker: broker.name,
      quantity,
      purchasePrice: price,
      purchaseDate: new Date(formData.date),
      transactionType: formData.type as 'BUY' | 'SELL',
      currency: 'USD'
    };

    const existingTransactions = JSON.parse(
      localStorage.getItem('transactions') || '[]'
    ) as Transaction[];

    const updatedTransactions = [...existingTransactions, transaction];

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    onSubmit(transaction);
    
    setFormData({
      ticker: '',
      brokerId: '',
      quantity: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      type: 'BUY'
    });
  };

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // 입력 즉시 대문자로 변환
    setFormData(prev => ({ ...prev, ticker: value }));
  };

  const formatNumber = (value: string) => {
    // 숫자만 추출
    const num = value.replace(/[^\d]/g, '');
    // 천 단위 구분자 추가
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // 숫자만 허용
    setFormData(prev => ({ 
      ...prev, 
      quantity: value 
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); // 숫자와 소수점만 허용
    setFormData(prev => ({ 
      ...prev, 
      price: value 
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">주식 거래 입력</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거래 유형
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="BUY">매수</option>
              <option value="SELL">매도</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              종목 코드
            </label>
            <input
              type="text"
              value={formData.ticker}
              onChange={handleTickerChange}
              placeholder="예: AAPL"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              증권사
            </label>
            <select
              value={formData.brokerId}
              onChange={(e) => setFormData(prev => ({ ...prev, brokerId: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">선택하세요</option>
              {brokers.map(broker => (
                <option key={broker.id} value={broker.id}>
                  {broker.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수량
            </label>
            <input
              type="text"
              value={formData.quantity ? formatNumber(formData.quantity) : ''}
              onChange={handleQuantityChange}
              placeholder="0"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격 (USD)
            </label>
            <input
              type="text"
              value={formData.price ? formatNumber(formData.price) : ''}
              onChange={handlePriceChange}
              placeholder="0.00"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거래일
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            거래 추가
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockTransactionForm; 