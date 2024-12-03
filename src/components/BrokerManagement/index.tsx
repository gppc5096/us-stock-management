import React, { useState, useEffect } from 'react';
import { Broker } from '../../types/broker';
import { brokerService } from '../../services/brokerService';

export const BrokerManagement: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [newBrokerName, setNewBrokerName] = useState('');

  useEffect(() => {
    setBrokers(brokerService.getBrokers());
  }, []);

  const handleAddBroker = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBrokerName.trim()) {
      const newBroker = brokerService.addBroker(newBrokerName.trim());
      setBrokers(prev => [...prev, newBroker]);
      setNewBrokerName('');
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    brokerService.updateBroker(id, { isActive });
    setBrokers(prev => 
      prev.map(broker => 
        broker.id === id ? { ...broker, isActive } : broker
      )
    );
  };

  const handleDelete = (id: string) => {
    brokerService.deleteBroker(id);
    setBrokers(prev => prev.filter(broker => broker.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">증권사 관리</h2>
      
      <form onSubmit={handleAddBroker} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBrokerName}
            onChange={(e) => setNewBrokerName(e.target.value)}
            placeholder="증권사 이름 입력"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            추가
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {brokers.map(broker => (
          <div key={broker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={broker.isActive}
                onChange={(e) => handleToggleActive(broker.id, e.target.checked)}
                className="w-4 h-4"
              />
              <span>{broker.name}</span>
            </div>
            <button
              onClick={() => handleDelete(broker.id)}
              className="text-red-600 hover:text-red-800"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 