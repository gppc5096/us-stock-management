import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { portfolioService } from '../../services/portfolioService';
import { formatters } from '../../utils/formatters';
import { chartColors, defaultChartOptions } from '../../utils/chartConfig';

export const BrokerDistribution: React.FC = () => {
  const [distribution, setDistribution] = useState(portfolioService.calculateBrokerDistribution());

  useEffect(() => {
    const handleStorageChange = () => {
      setDistribution(portfolioService.calculateBrokerDistribution());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const chartData = {
    labels: distribution.map(d => d.broker),
    datasets: [{
      data: distribution.map(d => d.value),
      backgroundColor: chartColors
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">증권사별 자산 분포</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square">
          <Pie data={chartData} options={defaultChartOptions} />
        </div>
        <div className="space-y-2">
          {distribution.map(item => (
            <div key={item.broker} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{item.broker}</span>
              <div className="text-right">
                <div className="font-bold">
                  {formatters.number.formatCurrency(item.value, 'USD')}
                </div>
                <div className="text-sm text-gray-500">
                  {formatters.number.formatPercent(item.percentage)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrokerDistribution; 