import React, { Suspense, lazy } from 'react';
import { Transaction } from './types';

const StockTransactionForm = lazy(() => import('./components/StockTransactionForm'));
const StockListTable = lazy(() => import('./components/StockListTable'));
const AssetStatistics = lazy(() => import('./components/AssetStatistics'));
const CurrencyConverter = lazy(() => import('./components/CurrencyConverter'));
const RealTimePriceTracker = lazy(() => import('./components/RealTimePriceTracker'));

function App() {
  const handleTransactionSubmit = (transaction: Transaction) => {
    const storedTransactions = JSON.parse(
      localStorage.getItem('transactions') || '[]'
    ) as Transaction[];
    const updatedTransactions = [...storedTransactions, transaction];
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  return (
    <div className="App">
      <header className="bg-blue-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">미국 주식 포트폴리오 관리</h1>
          <p className="mt-2 text-blue-100">
            나의 해외 주식 투자를 한눈에 관리하세요
          </p>
        </div>
      </header>
      
      <Suspense fallback={<div>로딩 중...</div>}>
        <main className="container mx-auto px-4 py-8">
          <StockTransactionForm onSubmit={handleTransactionSubmit} />
          <div className="mt-8">
            <RealTimePriceTracker />
          </div>
          <div className="mt-8">
            <CurrencyConverter />
          </div>
          <div className="mt-8">
            <AssetStatistics />
          </div>
          <div className="mt-8">
            <StockListTable />
          </div>
        </main>
      </Suspense>
    </div>
  );
}

export default App;
