import React, { useState, useEffect } from 'react';
import { formatters } from '../../utils/formatters';

export const PortfolioSummary: React.FC = () => {
  const [summary, setSummary] = useState({
    totalInvestment: 0,
    totalValue: 0,
    totalGainLoss: 0,
    returnRate: 0
  });

  useEffect(() => {
    const calculateSummary = () => {
      try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        let totalInvestment = 0;
        let totalValue = 0;

        transactions.forEach((transaction: any) => {
          const value = transaction.quantity * transaction.purchasePrice;
          if (transaction.transactionType === 'BUY') {
            totalInvestment += value;
            totalValue += value;
          } else {
            totalInvestment -= value;
            totalValue -= value;
          }
        });

        const gainLoss = totalValue - totalInvestment;
        const returnRate = totalInvestment === 0 ? 0 : (gainLoss / totalInvestment) * 100;

        setSummary({
          totalInvestment,
          totalValue,
          totalGainLoss: gainLoss,
          returnRate: returnRate
        });
      } catch (error) {
        console.error('포트폴리오 요약 계산 실패:', error);
      }
    };

    calculateSummary();

    const handleStorageChange = () => {
      calculateSummary();
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
            summary.returnRate >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatters.number.formatPercent(summary.returnRate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary; 