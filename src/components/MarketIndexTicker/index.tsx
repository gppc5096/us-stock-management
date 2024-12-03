import React, { useEffect, useState } from 'react';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const MarketIndexTicker: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);

  useEffect(() => {
    const fetchMarketIndices = async () => {
      const exampleData: MarketIndex[] = [
        { name: 'S&P500', value: 4783.35, change: 15.32, changePercent: 0.32 },
        { name: 'NASDAQ100', value: 16832.92, change: -20.12, changePercent: -0.12 },
        { name: 'DOW', value: 37305.16, change: 237.64, changePercent: 0.64 },
      ];
      setIndices(exampleData);
    };

    fetchMarketIndices();
    const interval = setInterval(fetchMarketIndices, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-ticker-container">
      <div className="market-ticker-content">
        {indices.map((index, idx) => (
          <React.Fragment key={index.name}>
            <span className="text-lg">
              <span className="font-semibold">{index.name}</span>{' '}
              <span className={index.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                {index.value.toFixed(2)}{' '}
                {index.change >= 0 ? '▲' : '▼'}{' '}
                ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </span>
            </span>
            {idx < indices.length - 1 && <span className="mx-8 text-gray-400">|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MarketIndexTicker; 