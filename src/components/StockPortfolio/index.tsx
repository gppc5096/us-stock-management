import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { portfolioService } from '../../services/portfolioService';
import { formatters } from '../../utils/formatters';

export const StockPortfolio: React.FC = () => {
  const [holdings, setHoldings] = useState(portfolioService.calculateHoldings());

  useEffect(() => {
    const handleStorageChange = () => {
      setHoldings(portfolioService.calculateHoldings());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const chartData = {
    labels: holdings.map(h => h.ticker),
    datasets: [{
      data: holdings.map(h => h.currentValue),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ]
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">종목별 포트폴리오</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square">
          <Doughnut data={chartData} options={{ maintainAspectRatio: true }} />
        </div>
        <div className="overflow-auto max-h-[400px]">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">종목</th>
                <th className="px-4 py-2 text-right">수량</th>
                <th className="px-4 py-2 text-right">평균단가</th>
                <th className="px-4 py-2 text-right">현재가치</th>
                <th className="px-4 py-2 text-right">손익률</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {holdings.map(holding => (
                <tr key={holding.ticker}>
                  <td className="px-4 py-2">{holding.ticker}</td>
                  <td className="px-4 py-2 text-right">
                    {formatters.number.format(holding.quantity)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatters.number.formatCurrency(holding.averagePrice, 'USD')}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatters.number.formatCurrency(holding.currentValue, 'USD')}
                  </td>
                  <td className={`px-4 py-2 text-right ${
                    holding.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatters.number.formatPercent(holding.gainLossPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockPortfolio; 