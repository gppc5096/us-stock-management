# 미국 주식 관리 앱 (US-STOCK-MANAGEMENT)

## 1. 프로젝트 개요

### 1.1 목적
미국 주식 관리 앱은 실시간 데이터, 종합적인 추적 기능 및 직관적인 사용자 인터페이스를 통해 사용자가 미국 주식 투자를 추적하고 관리할 수 있도록 설계된 종합적인 React 기반 애플리케이션입니다.

## 2. 기술 명세

### 2.1 핵심 기술
- **프론트엔드 프레임워크**: React (최신 안정 버전)
- **상태 관리**: React Hooks (useState, useEffect)
- **데이터 저장**: LocalStorage
- **환율 변환**: 외부 API 통합
- **스타일링**: Tailwind CSS
- **타이포그래피**: 구글 폰트 (고운 도둠)

### 2.2 주요 기능
1. **주식 거래 관리**
   - 매수 및 매도 거래 입력
   - LocalStorage 기반 데이터 저장
   - CRUD (생성, 읽기, 수정, 삭제) 작업

2. **통화 처리**
   - 이중 통화 지원 (KRW 및 USD)
   - 실시간 환율 통합
   - 자동 통화 변환

3. **자산 추적**
   - 증권사별 자산 분석
   - 종목별 포트폴리오 분석
   - KRW와 USD 모두에서 총 자산 평가

### 2.3 기술 아키텍처

#### 2.3.1 컴포넌트 구조
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

### 2.4 데이터 모델

#### 2.4.1 주식 거래 인터페이스
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

#### 2.4.2 자산 통계 인터페이스
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

### 2.5 주요 Hooks 및 서비스

#### 2.5.1 useLocalStorage Hook
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // LocalStorage에서 데이터 저장 및 검색
  // JSON 직렬화/역직렬화 처리
}
```

#### 2.5.2 환율 변환 서비스
```typescript
async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  // 실시간 환율 조회
  // 통화 변환 수행
}
```

### 2.6 외부 API 통합

#### 2.6.1 주식 가격 추적
- Alpha Vantage 또는 Yahoo Finance API를 통한 실시간 주식 가격
- 일별/시간별 가격 업데이트 메커니즘
- API 요청 실패에 대한 오류 처리

### 2.7 성능 고려사항
- 복잡한 계산의 메모이제이션
- 효율적인 LocalStorage 사용
- 빈번한 작업에 대한 디바운스/쓰로틀
- 무거운 컴포넌트의 지연 로딩

## 3. 개발 가이드라인

### 3.1 개발 환경
- Node.js (v18+)
- React (v18+)
- Tailwind CSS
- TypeScript 권장

### 3.2 설치 지침
```bash
# 저장소 복제
git clone https://github.com/your-username/us-stock-management.git

# 의존성 설치
npm install

# 개발 서버 시작
npm run start

# 프로덕션 빌드
npm run build
```

### 3.3 코딩 표준
- React 함수형 컴포넌트 패턴 준수
- 타입 안전성을 위한 TypeScript 사용
- 포괄적인 오류 경계 구현
- 중요 기능에 대한 단위 테스트 작성

## 4. 보안 고려사항
- 모든 사용자 입력 검증
- 안전한 LocalStorage 사용
- 외부 API 호출에 대한 속도 제한 구현
- 민감한 정보 저장 금지

## 5. 향후 개선사항
- 클라우드 동기화 기능
- 고급 차트 및 분석
- 머신러닝 기반 투자 인사이트
- 다중 시장 지원

## 6. 배포
- 권장 플랫폼: Vercel, Netlify
- 지속적 통합/지속적 배포(CI/CD) 파이프라인
- 성능 최적화 빌드

## 7. 규정 준수 및 법적 사항
- 금융 데이터 규정 준수 확인
- 투자 위험에 대한 적절한 면책조항 추가
- 사용자 데이터 보호 조치 구현

---

**참고**: 이 기술 문서는 미국 주식 관리 앱 개발을 위한 종합적인 청사진을 제공합니다. 특정 프로젝트 요구사항에 따라 조정 및 사용자 정의하시기 바랍니다. 