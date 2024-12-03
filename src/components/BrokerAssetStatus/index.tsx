import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { formatters } from '../../utils/formatters';

interface BrokerAsset {
  broker: string;
  totalValue: number;
  stockCount: number;
  gainLoss: number;
  gainLossPercent: number;
}

export const BrokerAssetStatus: React.FC = () => {
  const [brokerAssets, setBrokerAssets] = useState<BrokerAsset[]>([]);

  useEffect(() => {
    const calculateBrokerAssets = () => {
      const transactions = portfolioService.getTransactions();
      const holdings = portfolioService.calculateHoldings();
      
      // 증권사별 자산 계산
      const brokerMap = new Map<string, BrokerAsset>();
      
      transactions.forEach(transaction => {
        if (!brokerMap.has(transaction.broker)) {
          brokerMap.set(transaction.broker, {
            broker: transaction.broker,
            totalValue: 0,
            stockCount: 0,
            gainLoss: 0,
            gainLossPercent: 0
          });
        }
        
        const brokerAsset = brokerMap.get(transaction.broker)!;
        const holding = holdings.find(h => h.ticker === transaction.ticker);
        
        if (holding) {
          brokerAsset.totalValue += holding.currentValue;
          brokerAsset.gainLoss += holding.gainLoss;
          if (!brokerAsset.stockCount) {
            brokerAsset.stockCount = 1;
          }
        }
      });

      // 수익률 계산
      brokerMap.forEach(asset => {
        if (asset.totalValue > 0) {
          asset.gainLossPercent = (asset.gainLoss / (asset.totalValue - asset.gainLoss)) * 100;
        }
      });

      setBrokerAssets(Array.from(brokerMap.values()));
    };

    calculateBrokerAssets();
    window.addEventListener('storage', calculateBrokerAssets);
    return () => window.removeEventListener('storage', calculateBrokerAssets);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">증권사별 자산현황</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                증권사
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                보유종목수
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평가금액
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평가손익
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                수익률
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brokerAssets.map((asset) => (
              <tr key={asset.broker}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {asset.broker}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {asset.stockCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {formatters.number.formatCurrency(asset.totalValue, 'USD')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right ${
                  asset.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatters.number.formatCurrency(asset.gainLoss, 'USD')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right ${
                  asset.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatters.number.formatPercent(asset.gainLossPercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrokerAssetStatus; 