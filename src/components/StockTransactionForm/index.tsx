import React, { useState, useEffect, useRef } from 'react';
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
  const tickerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBrokers(brokerService.getActiveBrokers());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push(transaction);
      
      localStorage.setItem('transactions', JSON.stringify(transactions));
      onSubmit(transaction);
      
      // 폼 초기화
      setFormData({
        ticker: '',
        brokerId: '',
        quantity: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        type: 'BUY'
      });
      
      // 커서를 종목코드 입력 필드로 이동
      tickerInputRef.current?.focus();
      
    } catch (error) {
      console.error('거래 저장 실패:', error);
    }
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
              ref={tickerInputRef}
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