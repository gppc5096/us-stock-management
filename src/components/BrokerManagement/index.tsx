import React, { useState, useEffect } from 'react';

interface Broker {
  id: number;
  name: string;
}

export const BrokerManagement: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [newBroker, setNewBroker] = useState('');
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);

  useEffect(() => {
    const savedBrokers = JSON.parse(localStorage.getItem('brokers') || '[]');
    setBrokers(savedBrokers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBroker) {
      // 수정 모드
      const updatedBrokers = brokers.map(broker => 
        broker.id === editingBroker.id ? { ...broker, name: newBroker } : broker
      );
      setBrokers(updatedBrokers);
      localStorage.setItem('brokers', JSON.stringify(updatedBrokers));
      setEditingBroker(null);
    } else {
      // 새로운 증권사 추가
      const newBrokerItem = {
        id: Date.now(),
        name: newBroker
      };
      const updatedBrokers = [...brokers, newBrokerItem];
      setBrokers(updatedBrokers);
      localStorage.setItem('brokers', JSON.stringify(updatedBrokers));
    }
    
    setNewBroker('');
  };

  const handleEdit = (broker: Broker) => {
    setEditingBroker(broker);
    setNewBroker(broker.name);
  };

  const handleDelete = (brokerId: number) => {
    if (window.confirm('이 증권사를 삭제하시겠습니까?')) {
      const updatedBrokers = brokers.filter(broker => broker.id !== brokerId);
      setBrokers(updatedBrokers);
      localStorage.setItem('brokers', JSON.stringify(updatedBrokers));
      
      if (editingBroker?.id === brokerId) {
        setEditingBroker(null);
        setNewBroker('');
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">증권사 관리</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBroker}
            onChange={(e) => setNewBroker(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="증권사명 입력"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {editingBroker ? '수정' : '추가'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold">등록된 증권사 목록</h3>
        {brokers.map(broker => (
          <div
            key={broker.id}
            className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm"
          >
            <span>{broker.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(broker)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(broker.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokerManagement; 