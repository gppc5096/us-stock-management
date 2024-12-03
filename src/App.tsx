import React, { Suspense } from 'react';
import StockTransactionForm from './components/StockTransactionForm';
import StockListTable from './components/StockListTable';
import BrokerManagement from './components/BrokerManagement';
import PortfolioSummary from './components/PortfolioSummary';
import BrokerDistribution from './components/BrokerDistribution';
import StockPortfolio from './components/StockPortfolio';
import CurrencyConverter from './components/CurrencyConverter';
import RealTimePriceTracker from './components/RealTimePriceTracker';
import BrokerAssetStatus from './components/BrokerAssetStatus';
import StockPortfolioStatus from './components/StockPortfolioStatus';
import Settings from './components/Settings';
import MarketIndexTicker from './components/MarketIndexTicker';
import { Transaction } from './types';

function App() {
  const handleTransactionSubmit = (transaction: Transaction) => {
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="App min-h-screen">
      {/* 헤더 섹션 - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <header className="bg-blue-600 shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-white">
              미국 주식 포트폴리오 관리
            </h1>
          </div>
        </header>

        {/* 미국 3대 지수 스크롤 바 - Fixed */}
        <MarketIndexTicker />
      </div>

      {/* 메인 컨텐츠 - 스크롤 가능 영역 */}
      <div className="content-wrapper pt-40"> {/* 상단 fixed 영역 높이만큼 여백 */}
        <Suspense fallback={<div>로딩 중...</div>}>
          <main className="container mx-auto px-4 py-8 space-y-8">
            {/* 주식 거래 입력 및 증권사 관리 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <StockTransactionForm onSubmit={handleTransactionSubmit} />
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <BrokerManagement />
              </div>
            </div>

            {/* 나머지 컴포넌트들... */}
            <div className="bg-cyan-50 p-6 rounded-lg shadow">
              <StockListTable />
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow">
              <RealTimePriceTracker />
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <CurrencyConverter />
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg shadow">
              <PortfolioSummary />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-pink-50 p-6 rounded-lg shadow">
                <BrokerDistribution />
              </div>
              <div className="bg-teal-50 p-6 rounded-lg shadow">
                <StockPortfolio />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg shadow">
              <BrokerAssetStatus />
            </div>

            <div className="bg-rose-50 p-6 rounded-lg shadow">
              <StockPortfolioStatus />
            </div>

            <div className="bg-violet-50 p-6 rounded-lg shadow">
              <Settings />
            </div>
          </main>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
