import React, { useEffect, useState, useCallback } from 'react';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const DEFAULT_INDICES: MarketIndex[] = [
  { name: 'S&P500', value: 0, change: 0, changePercent: 0 },
  { name: 'NASDAQ100', value: 0, change: 0, changePercent: 0 },
  { name: 'DOW', value: 0, change: 0, changePercent: 0 },
];

const MarketIndexTicker: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMarketIndices = useCallback(async () => {
    const symbols = ['^GSPC', '^NDX', '^DJI'];
    
    try {
      const timestamp = new Date().getTime();
      const responses = await Promise.all(
        symbols.map(symbol =>
          fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d&timestamp=${timestamp}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          })
        )
      );

      const data = await Promise.all(responses.map(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      }));
      
      console.log('API Response:', data);

      const formattedData: MarketIndex[] = data.map((item, index) => {
        if (!item.chart?.result?.[0]?.meta) {
          console.error(`Invalid data structure for ${symbols[index]}:`, item);
          throw new Error('Invalid data structure');
        }

        const result = item.chart.result[0];
        const meta = result.meta;
        const quote = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        
        if (!quote || !previousClose) {
          console.error(`Missing price data for ${symbols[index]}:`, meta);
          throw new Error('Missing price data');
        }

        const change = quote - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        console.log(`${symbols[index]} latest data:`, {
          quote,
          previousClose,
          change,
          changePercent,
          timestamp: new Date().toLocaleTimeString()
        });

        return {
          name: symbols[index] === '^GSPC' ? 'S&P500' :
                symbols[index] === '^NDX' ? 'NASDAQ100' : 'DOW',
          value: quote,
          change: change,
          changePercent: changePercent
        };
      });

      console.log('Formatted Data:', formattedData);
      
      if (formattedData.every(index => index.value > 0)) {
        setIndices(formattedData);
        setIsLoading(false);
      } else {
        throw new Error('Invalid market data received');
      }

    } catch (error) {
      console.error('지수 데이터 가져오기 실패:', error);
      setIndices(prev => prev.length > 0 ? prev : DEFAULT_INDICES);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketIndices();
    const interval = setInterval(fetchMarketIndices, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketIndices]);

  if (isLoading) {
    return (
      <div className="market-ticker-container">
        <div className="market-ticker-content">
          <span className="text-lg">데이터 로딩 중...</span>
        </div>
      </div>
    );
  }

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