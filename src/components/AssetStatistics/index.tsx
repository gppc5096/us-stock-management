import React, { useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface StockTransaction {
  id: string;
  ticker: string;
  broker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currency: 'USD' | 'KRW';
  transactionType: 'BUY' | 'SELL';
}

// 인터페이스를 타입으로 직접 사용
type AssetData = {
  broker: string;
  ticker: string;
  totalValue: number;
  quantity?: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AssetStatistics: React.FC = () => {
  const [transactions] = useLocalStorage<StockTransaction[]>('stock-transactions', []);

  // 증권사별 자산 계산
  const assetsByBroker = useMemo((): AssetData[] => {
    const brokerMap = new Map<string, number>();
    let totalAssets = 0;

    transactions.forEach(transaction => {
      const value = transaction.quantity * transaction.purchasePrice;
      if (transaction.transactionType === 'BUY') {
        brokerMap.set(transaction.broker, (brokerMap.get(transaction.broker) || 0) + value);
        totalAssets += value;
      } else {
        brokerMap.set(transaction.broker, (brokerMap.get(transaction.broker) || 0) - value);
        totalAssets -= value;
      }
    });

    return Array.from(brokerMap.entries()).map(([broker, value]) => ({
      broker,
      ticker: '', // 필요한 필드이지만 증권사별 데이터에서는 사용하지 않음
      totalValue: value,
      percentage: (value / totalAssets) * 100
    }));
  }, [transactions]);

  // 종목별 자산 계산
  const assetsByStock = useMemo((): AssetData[] => {
    const stockMap = new Map<string, { value: number; quantity: number }>();
    let totalAssets = 0;

    transactions.forEach(transaction => {
      const value = transaction.quantity * transaction.purchasePrice;
      const currentStock = stockMap.get(transaction.ticker) || { value: 0, quantity: 0 };

      if (transaction.transactionType === 'BUY') {
        stockMap.set(transaction.ticker, {
          value: currentStock.value + value,
          quantity: currentStock.quantity + transaction.quantity
        });
        totalAssets += value;
      } else {
        stockMap.set(transaction.ticker, {
          value: currentStock.value - value,
          quantity: currentStock.quantity - transaction.quantity
        });
        totalAssets -= value;
      }
    });

    return Array.from(stockMap.entries())
      .map(([ticker, { value, quantity }]) => ({
        broker: '', // 필요한 필드이지만 종목별 데이터에서는 사용하지 않음
        ticker,
        totalValue: value,
        quantity,
        percentage: (value / totalAssets) * 100
      }))
      .filter(stock => stock.quantity! > 0); // 보유 수량이 있는 종목만 표시
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* 증권사별 자산 분포 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">증권사별 자산 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={assetsByBroker}
              dataKey="totalValue"
              nameKey="broker"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ broker, percentage }) => `${broker} (${percentage.toFixed(1)}%)`}
            >
              {assetsByBroker.map((entry, index) => (
                <Cell key={entry.broker} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 종목별 포트폴리오 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">종목별 포트폴리오</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assetsByStock}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ticker" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalValue" name="총 자산" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 자산 요약 */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">자산 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">증권사별 자산</h4>
            <ul className="space-y-2">
              {assetsByBroker.map(({ broker, totalValue, percentage }) => (
                <li key={broker} className="flex justify-between">
                  <span>{broker}</span>
                  <span>
                    ${totalValue.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">주요 보유 종목</h4>
            <ul className="space-y-2">
              {assetsByStock.map(({ ticker, totalValue, quantity, percentage }) => (
                <li key={ticker} className="flex justify-between">
                  <span>{ticker} ({quantity}주)</span>
                  <span>
                    ${totalValue.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetStatistics; 