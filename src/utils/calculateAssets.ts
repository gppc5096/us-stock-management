interface Transaction {
  id: string;
  ticker: string;
  broker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currency: 'USD' | 'KRW';
  transactionType: 'BUY' | 'SELL';
}

interface AssetSummary {
  totalInvestment: number;
  totalValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  assetsByBroker: {
    [broker: string]: number;
  };
  assetsByStock: {
    [ticker: string]: {
      quantity: number;
      averagePrice: number;
      totalValue: number;
      gainLoss: number;
      gainLossPercentage: number;
    };
  };
}

export function calculateAssets(
  transactions: Transaction[],
  currentPrices: { [ticker: string]: number }
): AssetSummary {
  const summary: AssetSummary = {
    totalInvestment: 0,
    totalValue: 0,
    totalGainLoss: 0,
    gainLossPercentage: 0,
    assetsByBroker: {},
    assetsByStock: {}
  };

  // 거래내역 처리
  transactions.forEach(transaction => {
    const { ticker, broker, quantity, purchasePrice, transactionType } = transaction;
    const value = quantity * purchasePrice;

    // 종목별 자산 계산
    if (!summary.assetsByStock[ticker]) {
      summary.assetsByStock[ticker] = {
        quantity: 0,
        averagePrice: 0,
        totalValue: 0,
        gainLoss: 0,
        gainLossPercentage: 0
      };
    }

    const stockSummary = summary.assetsByStock[ticker];
    
    if (transactionType === 'BUY') {
      const newQuantity = stockSummary.quantity + quantity;
      stockSummary.averagePrice = (
        (stockSummary.quantity * stockSummary.averagePrice + value) / newQuantity
      );
      stockSummary.quantity = newQuantity;
    } else {
      stockSummary.quantity -= quantity;
    }

    // 증권사별 자산 계산
    summary.assetsByBroker[broker] = (summary.assetsByBroker[broker] || 0) +
      (transactionType === 'BUY' ? value : -value);
  });

  // 현재 가치 및 손익 계산
  Object.entries(summary.assetsByStock).forEach(([ticker, stock]) => {
    const currentPrice = currentPrices[ticker] || stock.averagePrice;
    stock.totalValue = stock.quantity * currentPrice;
    stock.gainLoss = stock.totalValue - (stock.quantity * stock.averagePrice);
    stock.gainLossPercentage = (stock.gainLoss / (stock.quantity * stock.averagePrice)) * 100;

    summary.totalValue += stock.totalValue;
    summary.totalInvestment += stock.quantity * stock.averagePrice;
  });

  // 전체 손익 계산
  summary.totalGainLoss = summary.totalValue - summary.totalInvestment;
  summary.gainLossPercentage = (summary.totalGainLoss / summary.totalInvestment) * 100;

  return summary;
}
