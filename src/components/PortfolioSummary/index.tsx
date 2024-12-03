import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { formatters } from '../../utils/formatters';

export const PortfolioSummary: React.FC = () => {
  const [summary, setSummary] = useState(portfolioService.calculateSummary());

  useEffect(() => {
    const handleStorageChange = () => {
      setSummary(portfolioService.calculateSummary());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">자산 요약</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">총 자산</h3>
          <p className="text-2xl font-bold">
            {formatters.number.formatCurrency(summary.totalValue, 'USD')}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">총 투자</h3>
          <p className="text-2xl font-bold">
            {formatters.number.formatCurrency(summary.totalInvestment, 'USD')}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">총 손익</h3>
          <p className={`text-2xl font-bold ${
            summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatters.number.formatCurrency(summary.totalGainLoss, 'USD')}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-sm text-gray-500">수익률</h3>
          <p className={`text-2xl font-bold ${
            summary.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatters.number.formatPercent(summary.gainLossPercent)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary; 