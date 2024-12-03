import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useStockPrice } from '../../hooks/useStockPrice';

interface TrackedStock {
  symbol: string;
  name?: string;
}

export const RealTimePriceTracker: React.FC = () => {
  const [trackedStocks, setTrackedStocks] = useLocalStorage<TrackedStock[]>('tracked-stocks', []);
  const [newSymbol, setNewSymbol] = useState('');
  
  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol && !trackedStocks.some(stock => stock.symbol === newSymbol.toUpperCase())) {
      setTrackedStocks([...trackedStocks, { symbol: newSymbol.toUpperCase() }]);
      setNewSymbol('');
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setTrackedStocks(trackedStocks.filter(stock => stock.symbol !== symbol));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">실시간 주가 추적</h2>

      {/* 종목 추가 폼 */}
      <form onSubmit={handleAddSymbol} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="종목 코드 입력 (예: AAPL)"
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            추가
          </button>
        </div>
      </form>

      {/* 추적 중인 종목 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackedStocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            onRemove={handleRemoveSymbol}
          />
        ))}
      </div>
    </div>
  );
};

interface StockCardProps {
  symbol: string;
  onRemove: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, onRemove }) => {
  const { quote, loading, error } = useStockPrice(symbol);

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{symbol}</h3>
        <button
          onClick={() => onRemove(symbol)}
          className="text-gray-400 hover:text-red-500"
        >
          ×
        </button>
      </div>

      {loading && <p className="text-gray-600">로딩 중...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {quote && !loading && !error && (
        <div>
          <p className="text-2xl font-bold">${quote.price.toFixed(2)}</p>
          <p className={`text-sm ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {quote.change >= 0 ? '▲' : '▼'} ${Math.abs(quote.change).toFixed(2)} 
            ({quote.changePercent.toFixed(2)}%)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            최종 업데이트: {quote.lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default RealTimePriceTracker; 