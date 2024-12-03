import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface StockTransactionFormProps {
  onSubmit: (transaction: StockTransaction) => void;
}

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

interface FormErrors {
  ticker?: string;
  broker?: string;
  quantity?: string;
  purchasePrice?: string;
  purchaseDate?: string;
}

export const StockTransactionForm: React.FC<StockTransactionFormProps> = ({ onSubmit }) => {
  // LocalStorage에서 거래 내역 관리
  const [transactions, setTransactions] = useLocalStorage<StockTransaction[]>('stock-transactions', []);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState<Omit<StockTransaction, 'id'>>({
    ticker: '',
    broker: '',
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: new Date(),
    currency: 'USD',
    transactionType: 'BUY',
  });

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<FormErrors>({});
  
  // 최소/최대 날짜 설정
  const minDate = new Date('2000-01-01').toISOString().split('T')[0];
  const maxDate = new Date().toISOString().split('T')[0];

  // 유효성 검사 함수
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 종목 코드 검사
    if (!formData.ticker) {
      newErrors.ticker = '종목 코드를 입력하세요';
    } else if (!/^[A-Z]{1,5}$/.test(formData.ticker)) {
      newErrors.ticker = '올바른 종목 코드 형식이 아닙니다';
    }

    // 증권사 검사
    if (!formData.broker) {
      newErrors.broker = '증권사를 선택하세요';
    }

    // 수량 검사
    if (formData.quantity <= 0) {
      newErrors.quantity = '수량은 0보다 커야 합니다';
    }

    // 가격 검사
    if (formData.purchasePrice <= 0) {
      newErrors.purchasePrice = '가격은 0보다 커야 합니다';
    }

    // 날짜 검사
    const selectedDate = new Date(formData.purchaseDate);
    const minDateTime = new Date('2000-01-01');
    const maxDateTime = new Date();
    
    if (selectedDate < minDateTime || selectedDate > maxDateTime) {
      newErrors.purchaseDate = '올바른 날짜 범위가 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newTransaction = {
      ...formData,
      id: crypto.randomUUID(),
    };

    // LocalStorage에 저장
    setTransactions([...transactions, newTransaction]);
    
    // 상위 컴포넌트에 알림
    onSubmit(newTransaction);

    // 폼 초기화
    setFormData({
      ticker: '',
      broker: '',
      quantity: 0,
      purchasePrice: 0,
      purchaseDate: new Date(),
      currency: 'USD',
      transactionType: 'BUY',
    });
  };

  // 날짜 변경 처리
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setFormData({ ...formData, purchaseDate: date });
      setErrors({ ...errors, purchaseDate: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">주식 거래 입력</h2>
      
      {/* 거래 유형 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          거래 유형
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="BUY"
              checked={formData.transactionType === 'BUY'}
              onChange={(e) => setFormData({ ...formData, transactionType: 'BUY' })}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">매수</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="SELL"
              checked={formData.transactionType === 'SELL'}
              onChange={(e) => setFormData({ ...formData, transactionType: 'SELL' })}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2">매도</span>
          </label>
        </div>
      </div>

      {/* 종목 코드 입력 */}
      <div className="mb-4">
        <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-2">
          종목 코드
        </label>
        <input
          type="text"
          id="ticker"
          value={formData.ticker}
          onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      {/* 증권사 선택 */}
      <div className="mb-4">
        <label htmlFor="broker" className="block text-sm font-medium text-gray-700 mb-2">
          증권사
        </label>
        <select
          id="broker"
          value={formData.broker}
          onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
          className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          {/* 증권사 옵션들을 여기에 추가하세요 */}
        </select>
      </div>

      {/* 날짜 선택기 업데이트 */}
      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          거래일
        </label>
        <input
          type="date"
          id="date"
          value={formData.purchaseDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          min={minDate}
          max={maxDate}
          className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm
            ${errors.purchaseDate ? 'border-red-500' : ''}`}
          required
        />
        {errors.purchaseDate && (
          <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>
        )}
      </div>

      {/* 에러 메시지 표시 추가 */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">입력 오류를 확인해주세요:</p>
          <ul className="list-disc list-inside">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        거래 입력
      </button>
    </form>
  );
};

export default StockTransactionForm; 