import React, { useState, useEffect } from 'react';
import { formatters } from '../../utils/formatters';

interface StockHolding {
  ticker: string;
  totalQuantity: number;
  purchaseAmount: number;
  currentValue: number;
  gainLoss: number;
  weight: number;
  returnRate: number;
}

export const StockPortfolioStatus: React.FC = () => {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [summary, setSummary] = useState({
    totalQuantity: 0,
    totalPurchaseAmount: 0,
    totalCurrentValue: 0,
    totalGainLoss: 0,
    totalWeight: 100,
    averageReturn: 0
  });

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
              totalQuantity: 0,
              purchaseAmount: 0,
              currentValue: 0,
              gainLoss: 0,
              weight: 0,
              returnRate: 0
            });
          }

          const holding = holdingsMap.get(ticker)!;
          if (transactionType === 'BUY') {
            holding.totalQuantity += quantity;
            holding.purchaseAmount += value;
          } else {
            holding.totalQuantity -= quantity;
            holding.purchaseAmount -= value;
          }
          
          // 현재가는 임시로 매수가의 110%로 설정 (실제로는 API에서 받아와야 함)
          holding.currentValue = holding.totalQuantity * (purchasePrice * 1.1);
          holding.gainLoss = holding.currentValue - holding.purchaseAmount;
          holding.returnRate = (holding.gainLoss / holding.purchaseAmount) * 100;
        });

        const validHoldings = Array.from(holdingsMap.values())
          .filter(holding => holding.totalQuantity > 0);

        const totalCurrentValue = validHoldings.reduce((sum, h) => sum + h.currentValue, 0);
        
        // 비중 계산
        validHoldings.forEach(holding => {
          holding.weight = (holding.currentValue / totalCurrentValue) * 100;
        });

        // 요약 정보 계산
        const summaryInfo = {
          totalQuantity: validHoldings.reduce((sum, h) => sum + h.totalQuantity, 0),
          totalPurchaseAmount: validHoldings.reduce((sum, h) => sum + h.purchaseAmount, 0),
          totalCurrentValue: totalCurrentValue,
          totalGainLoss: validHoldings.reduce((sum, h) => sum + h.gainLoss, 0),
          totalWeight: 100,
          averageReturn: (validHoldings.reduce((sum, h) => sum + h.returnRate, 0) / validHoldings.length) || 0
        };

        setSummary(summaryInfo);
        return validHoldings;
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">종목별 포트폴리오 현황</h2>
      
      {/* 요약 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">보유수량</div>
          <div className="font-semibold">{summary.totalQuantity.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">매수금액</div>
          <div className="font-semibold">{formatters.number.formatCurrency(Math.floor(summary.totalPurchaseAmount), 'USD')}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">평가금액</div>
          <div className="font-semibold">{formatters.number.formatCurrency(Math.floor(summary.totalCurrentValue), 'USD')}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">평가손익</div>
          <div className={`font-semibold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatters.number.formatCurrency(Math.floor(summary.totalGainLoss), 'USD')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">비중</div>
          <div className="font-semibold">{Math.floor(summary.totalWeight)}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">수익률</div>
          <div className={`font-semibold ${summary.averageReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.floor(summary.averageReturn)}%
          </div>
        </div>
      </div>

      {/* 종목별 상세 정보 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                종목명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                보유수량
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                매수금액
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평가금액
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평가손익
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                비중(%)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                수익률(%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map(holding => (
              <tr key={holding.ticker}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {holding.ticker}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {holding.totalQuantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {formatters.number.formatCurrency(Math.floor(holding.purchaseAmount), 'USD')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {formatters.number.formatCurrency(Math.floor(holding.currentValue), 'USD')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right ${
                  holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatters.number.formatCurrency(Math.floor(holding.gainLoss), 'USD')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {Math.floor(holding.weight)}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right ${
                  holding.returnRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.floor(holding.returnRate)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPortfolioStatus; 