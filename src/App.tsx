import React from 'react';
import { StockTransactionForm } from './components/StockTransactionForm';
import { StockListTable } from './components/StockListTable';
import { AssetStatistics } from './components/AssetStatistics';
import { CurrencyConverter } from './components/CurrencyConverter';
import { RealTimePriceTracker } from './components/RealTimePriceTracker';

function App() {
  const handleTransactionSubmit = (transaction: any) => {
    console.log('New transaction:', transaction);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl font-bold mb-4">미국 주식 관리</h1>
      </header>
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
    </div>
  );
}

export default App;
