import { Broker } from '../types/broker';

class BrokerService {
  private readonly STORAGE_KEY = 'brokers';

  getBrokers(): Broker[] {
    const storedBrokers = localStorage.getItem(this.STORAGE_KEY);
    if (!storedBrokers) return [];
    return JSON.parse(storedBrokers).map((broker: any) => ({
      ...broker,
      createdAt: new Date(broker.createdAt)
    }));
  }

  getActiveBrokers(): Broker[] {
    return this.getBrokers().filter(broker => broker.isActive);
  }

  addBroker(name: string): void {
    const brokers = this.getBrokers();
    const newBroker: Broker = {
      id: crypto.randomUUID(),
      name: name.trim(),
      isActive: true,
      createdAt: new Date()
    };
    brokers.push(newBroker);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(brokers));
  }

  toggleBrokerStatus(brokerId: string): void {
    const brokers = this.getBrokers();
    const updatedBrokers = brokers.map(broker => 
      broker.id === brokerId 
        ? { ...broker, isActive: !broker.isActive }
        : broker
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedBrokers));
  }
}

export const brokerService = new BrokerService(); 