import { Broker } from '../types/broker';

class BrokerService {
  private readonly STORAGE_KEY = 'brokers';

  getBrokers(): Broker[] {
    const brokers = localStorage.getItem(this.STORAGE_KEY);
    return brokers ? JSON.parse(brokers) : this.getDefaultBrokers();
  }

  getActiveBrokers(): Broker[] {
    return this.getBrokers().filter(broker => broker.isActive);
  }

  addBroker(name: string): Broker {
    const brokers = this.getBrokers();
    const newBroker: Broker = {
      id: crypto.randomUUID(),
      name,
      isActive: true,
      createdAt: new Date()
    };
    
    brokers.push(newBroker);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(brokers));
    return newBroker;
  }

  updateBroker(id: string, updates: Partial<Broker>): void {
    const brokers = this.getBrokers();
    const index = brokers.findIndex(b => b.id === id);
    if (index !== -1) {
      brokers[index] = { ...brokers[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(brokers));
    }
  }

  deleteBroker(id: string): void {
    const brokers = this.getBrokers().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(brokers));
  }

  private getDefaultBrokers(): Broker[] {
    return [
      { id: '1', name: '토스증권', isActive: true, createdAt: new Date() },
      { id: '2', name: '키움증권', isActive: true, createdAt: new Date() },
      { id: '3', name: '한국투자증권', isActive: true, createdAt: new Date() }
    ];
  }
}

export const brokerService = new BrokerService(); 