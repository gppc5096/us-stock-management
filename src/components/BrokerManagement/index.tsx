import React, { useState } from 'react';
import { Broker } from '../../types/broker';
import { brokerService } from '../../services/brokerService';

export const BrokerManagement: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>(brokerService.getBrokers());
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [newBrokerName, setNewBrokerName] = useState('');

  const handleAddBroker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrokerName.trim()) return;

    brokerService.addBroker(newBrokerName.trim());
    setBrokers(brokerService.getBrokers());
    setNewBrokerName('');
  };

  const toggleBrokerStatus = (brokerId: string) => {
    brokerService.toggleBrokerStatus(brokerId);
    setBrokers(brokerService.getBrokers());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">증권사 관리</h2>
        <form onSubmit={handleAddBroker} className="flex gap-2">
          <input
            type="text"
            value={newBrokerName}
            onChange={(e) => setNewBrokerName(e.target.value)}
            placeholder="증권사명 입력"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            추가
          </button>
        </form>
      </div>

      <div 
        className="flex justify-between items-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
        onClick={() => setIsListExpanded(!isListExpanded)}
      >
        <h3 className="font-semibold">등록된 증권사 목록</h3>
        <span className="text-gray-500">
          {isListExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isListExpanded && (
        <div className="mt-2 space-y-2">
          {brokers.map(broker => (
            <div
              key={broker.id}
              className="flex justify-between items-center p-3 border rounded"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  broker.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>{broker.name}</span>
              </div>
              <button
                onClick={() => toggleBrokerStatus(broker.id)}
                className={`px-3 py-1 rounded text-sm ${
                  broker.isActive
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                {broker.isActive ? '비활성화' : '활성화'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrokerManagement; 