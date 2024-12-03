import React from 'react';
import { useStockData } from '../../hooks/useStockData';

interface StockDetailProps {
  symbol: string;
}

export const StockDetail: React.FC<StockDetailProps> = ({ symbol }) => {
  const { data, loading, error, lastUpdated, refresh } = useStockData(symbol, {
    autoRefresh: true,
    refreshInterval: 60000
  });

  if (loading) {
    return <div>데이터 로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
        <button onClick={refresh} className="text-blue-500 underline">
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{data.companyName}</h2>
          <p className="text-gray-500">{data.symbol}</p>
        </div>
        <button
          onClick={refresh}
          className="text-blue-500 hover:text-blue-700"
        >
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">현재가</p>
          <p className="text-xl font-bold">${data.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">변동</p>
          <p className={`text-xl font-bold ${
            data.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </p>
        </div>
        <div>
          <p className="text-gray-500">거래량</p>
          <p className="text-xl font-bold">{data.volume.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">시가총액</p>
          <p className="text-xl font-bold">${(data.marketCap / 1e9).toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-gray-500">P/E 비율</p>
          <p className="text-xl font-bold">{data.peRatio.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">52주 범위</p>
          <p className="text-xl font-bold">
            ${data.week52Low.toFixed(2)} - ${data.week52High.toFixed(2)}
          </p>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 mt-4">
          마지막 업데이트: {lastUpdated.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default StockDetail; 