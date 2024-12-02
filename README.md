# US Stock Management App

## 프로젝트 개요
미국 주식 관리 앱은 실시간 데이터, 종합적인 추적 기능 및 직관적인 사용자 인터페이스를 통해 사용자가 미국 주식 투자를 추적하고 관리할 수 있도록 설계된 종합적인 React 기반 애플리케이션입니다.

## 기술 스택
- **프론트엔드 프레임워크**: React 18
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: React Hooks
- **라우팅**: React Router Dom
- **폰트**: Google Fonts (Gowun Dodum)

## 프로젝트 구조
```
usa-stock-management-01/
├── public/
├── src/
│   ├── components/
│   │   ├── StockTransactionForm/
│   │   │   ├── index.tsx
│   │   │   └── styles.css
│   │   ├── StockListTable/
│   │   │   ├── index.tsx
│   │   │   └── styles.css
│   │   ├── AssetStatistics/
│   │   │   ├── index.tsx
│   │   │   └── styles.css
│   │   ├── CurrencyConverter/
│   │   │   ├── index.tsx
│   │   │   └── styles.css
│   │   └── RealTimePriceTracker/
│   │       ├── index.tsx
│   │       └── styles.css
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useCurrencyConversion.ts
│   │   └── useStockData.ts
│   ├── services/
│   │   ├── stockService.ts
│   │   ├── currencyService.ts
│   │   └── priceTrackingService.ts
│   ├── utils/
│   │   ├── calculateAssets.ts
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── .prettierrc
└── .eslintrc
```

## 주요 기능
1. **주식 거래 관리**
   - 매수/매도 거래 입력
   - 거래 내역 조회 및 관리
   - 데이터 영구 저장 (LocalStorage)

2. **자산 분석**
   - 증권사별 자산 현황
   - 종목별 포트폴리오 분석
   - 실시간 수익률 계산

3. **환율 관리**
   - 실시간 환율 정보
   - 자동 환율 변환
   - KRW/USD 동시 표시

## 시작하기

### 설치
```bash
# 저장소 복제
git clone https://github.com/your-username/usa-stock-management-01.git

# 프로젝트 폴더로 이동
cd usa-stock-management-01

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 빌드
```bash
# 프로덕션 빌드
npm run build
```

## 기여하기
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스
This project is licensed under the MIT License - see the LICENSE file for details

## 문의
- GitHub: [your-username](https://github.com/your-username)
- Email: your.email@example.com
