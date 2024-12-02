# US Stock Management App (US-STOCK-MANAGEMENT)

## 1. Project Overview

### 1.1 Purpose
The US Stock Management App is a comprehensive React-based application designed to help users track and manage their US stock investments with real-time data, comprehensive tracking, and intuitive user interface.

## 2. Technical Specifications

### 2.1 Core Technologies
- **Frontend Framework**: React (Latest Stable Version)
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: LocalStorage
- **Currency Conversion**: External API Integration
- **Styling**: Tailwind CSS
- **Typography**: Google Fonts (Gowun Dodum)

### 2.2 Key Features
1. **Stock Transaction Management**
   - Buy and sell transaction input
   - LocalStorage-based data persistence
   - CRUD (Create, Read, Update, Delete) operations

2. **Currency Handling**
   - Dual currency support (KRW and USD)
   - Real-time exchange rate integration
   - Automatic currency conversion

3. **Asset Tracking**
   - Broker-wise asset breakdown
   - Ticker-based portfolio analysis
   - Total asset valuation in both KRW and USD

### 2.3 Technical Architecture

#### 2.3.1 Component Structure
```
src/
│
├── components/
│   ├── StockTransactionForm/
│   ├── StockListTable/
│   ├── AssetStatistics/
│   ├── CurrencyConverter/
│   └── RealTimePriceTracker/
│
├── hooks/
│   ├── useLocalStorage.js
│   ├── useCurrencyConversion.js
│   └── useStockData.js
│
├── services/
│   ├── stockService.js
│   ├── currencyService.js
│   └── priceTrackingService.js
│
└── utils/
    ├── calculateAssets.js
    └── formatters.js
```

### 2.4 Data Models

#### 2.4.1 Stock Transaction Interface
```typescript
interface StockTransaction {
  id: string;
  ticker: string;
  broker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currency: 'USD' | 'KRW';
  transactionType: 'BUY' | 'SELL';
}
```

#### 2.4.2 Asset Statistics Interface
```typescript
interface AssetStatistics {
  totalUSDAssets: number;
  totalKRWAssets: number;
  brokerBreakdown: {
    [brokerName: string]: {
      usdAssets: number;
      krwAssets: number;
    }
  };
  tickerBreakdown: {
    [ticker: string]: {
      quantity: number;
      currentValue: number;
      profitLoss: number;
    }
  };
}
```

### 2.5 Key Hooks and Services

#### 2.5.1 useLocalStorage Hook
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // Store and retrieve data from LocalStorage
  // Handle JSON serialization/deserialization
}
```

#### 2.5.2 Currency Conversion Service
```typescript
async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  // Fetch real-time exchange rates
  // Perform currency conversion
}
```

### 2.6 External API Integration

#### 2.6.1 Stock Price Tracking
- Alpha Vantage or Yahoo Finance API for real-time stock prices
- Daily/hourly price update mechanism
- Error handling for API request failures

### 2.7 Performance Considerations
- Memoization of complex calculations
- Efficient LocalStorage usage
- Debounce/throttle for frequent operations
- Lazy loading of heavy components

## 3. Development Guidelines

### 3.1 Development Environment
- Node.js (v18+)
- React (v18+)
- Tailwind CSS
- TypeScript recommended

### 3.2 Setup Instructions
```bash
# Clone the repository
git clone https://github.com/your-username/us-stock-management.git

# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build
```

### 3.3 Coding Standards
- Follow React functional component patterns
- Use TypeScript for type safety
- Implement comprehensive error boundaries
- Write unit tests for critical functions

## 4. Security Considerations
- Sanitize all user inputs
- Use secure LocalStorage practices
- Implement rate limiting for external API calls
- No sensitive information storage

## 5. Future Enhancements
- Cloud sync functionality
- Advanced charting and analytics
- Machine learning-based investment insights
- Multi-market support

## 6. Deployment
- Recommended platforms: Vercel, Netlify
- Continuous Integration/Continuous Deployment (CI/CD) pipeline
- Performance optimization builds

## 7. Compliance and Legal
- Ensure compliance with financial data regulations
- Add appropriate disclaimers about investment risks
- Implement user data protection measures

---

**Note**: This technical documentation provides a comprehensive blueprint for developing the US Stock Management App. Adjust and customize according to specific project requirements.
