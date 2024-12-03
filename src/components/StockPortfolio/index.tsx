import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatters } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StockHolding {
  ticker: string;
  totalValue: number;
}

export const StockPortfolio: React.FC = () => {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);

  useEffect(() => {
    const calculateHoldings = () => {
      try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const holdingsMap = new Map<string, StockHolding>();

        transactions.forEach((transaction: any) => {
          const { ticker, quantity, purchasePrice, transactionType } = transaction;
          const value = quantity * purchasePrice;

          if (!holdingsMap.has(ticker)) {
            holdingsMap.set(ticker, {
              ticker,
              totalValue: 0
            });
          }

          const holding = holdingsMap.get(ticker)!;
          if (transactionType === 'BUY') {
            holding.totalValue += value;
          } else {
            holding.totalValue -= value;
          }
        });

        return Array.from(holdingsMap.values())
          .filter(holding => holding.totalValue > 0)
          .sort((a, b) => b.totalValue - a.totalValue);
      } catch (error) {
        console.error('포트폴리오 계산 실패:', error);
        return [];
      }
    };

    setHoldings(calculateHoldings());

    const handleStorageChange = () => {
      setHoldings(calculateHoldings());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const totalValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);

  const data = {
    labels: holdings.map(h => `${h.ticker} (${Math.floor((h.totalValue / totalValue) * 100)}%)`),
    datasets: [
      {
        data: holdings.map(h => h.totalValue),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return `${formatters.number.formatCurrency(Math.floor(value), 'USD')}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">종목별 포트폴리오</h2>
      {holdings.length > 0 ? (
        <div className="relative" style={{ height: '300px' }}>
          <Pie data={data} options={options} />
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          보유 중인 종목이 없습니다.
        </p>
      )}
    </div>
  );
};

export default StockPortfolio; 