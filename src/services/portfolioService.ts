import { Transaction } from '../types';

interface PortfolioSummary {
  totalValue: number;
  totalInvestment: number;
  totalGainLoss: number;
  gainLossPercent: number;
}

interface BrokerDistribution {
  broker: string;
  value: number;
  percentage: number;
}

interface StockHolding {
  ticker: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  percentage: number;
}

class PortfolioService {
  getTransactions(): Transaction[] {
    const stored = localStorage.getItem('transactions');
    if (!stored) return [];
    return JSON.parse(stored).map((t: any) => ({
      ...t,
      purchaseDate: new Date(t.purchaseDate)
    }));
  }

  calculateHoldings(): StockHolding[] {
    const transactions = this.getTransactions();
    const holdingsMap = new Map<string, StockHolding>();

    transactions.forEach(transaction => {
      const quantity = transaction.transactionType === 'BUY' ? transaction.quantity : -transaction.quantity;
      const currentPrice = this.getCurrentPrice(transaction.ticker); // 실제로는 API에서 가져와야 함

      if (!holdingsMap.has(transaction.ticker)) {
        holdingsMap.set(transaction.ticker, {
          ticker: transaction.ticker,
          quantity: 0,
          averagePrice: 0,
          currentValue: 0,
          gainLoss: 0,
          gainLossPercent: 0,
          percentage: 0
        });
      }

      const holding = holdingsMap.get(transaction.ticker)!;
      const oldQuantity = holding.quantity;
      const newQuantity = oldQuantity + quantity;

      if (transaction.transactionType === 'BUY' && newQuantity > 0) {
        holding.averagePrice = (oldQuantity * holding.averagePrice + quantity * transaction.purchasePrice) / newQuantity;
      }

      holding.quantity = newQuantity;
      holding.currentValue = newQuantity * currentPrice;
      holding.gainLoss = holding.currentValue - (newQuantity * holding.averagePrice);
      holding.gainLossPercent = (holding.gainLoss / (newQuantity * holding.averagePrice)) * 100;
    });

    const holdings = Array.from(holdingsMap.values()).filter(h => h.quantity > 0);
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

    return holdings.map(holding => ({
      ...holding,
      percentage: (holding.currentValue / totalValue) * 100
    }));
  }

  calculateBrokerDistribution(): BrokerDistribution[] {
    const holdings = this.calculateHoldings();
    const brokerMap = new Map<string, number>();

    this.getTransactions().forEach(transaction => {
      const holding = holdings.find(h => h.ticker === transaction.ticker);
      if (holding && transaction.transactionType === 'BUY') {
        const value = brokerMap.get(transaction.broker) || 0;
        brokerMap.set(transaction.broker, value + holding.currentValue);
      }
    });

    const totalValue = Array.from(brokerMap.values()).reduce((sum, value) => sum + value, 0);

    return Array.from(brokerMap.entries()).map(([broker, value]) => ({
      broker,
      value,
      percentage: (value / totalValue) * 100
    }));
  }

  calculateSummary(): PortfolioSummary {
    const holdings = this.calculateHoldings();
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvestment = holdings.reduce((sum, h) => sum + (h.quantity * h.averagePrice), 0);
    const totalGainLoss = totalValue - totalInvestment;

    return {
      totalValue,
      totalInvestment,
      totalGainLoss,
      gainLossPercent: (totalGainLoss / totalInvestment) * 100
    };
  }

  private getCurrentPrice(ticker: string): number {
    // 실제로는 API에서 현재가를 가져와야 합니다.
    // 임시로 랜덤 가격을 반환
    return Math.random() * 1000 + 100;
  }
}

export const portfolioService = new PortfolioService(); 