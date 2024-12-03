export const formatters = {
  // 숫자 포맷팅
  number: {
    // 일반 숫자
    format: (value: number, decimals: number = 2): string => {
      return new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
    },

    // 퍼센트
    formatPercent: (value: number, decimals: number = 2): string => {
      return new Intl.NumberFormat('ko-KR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value / 100);
    },

    // 통화
    formatCurrency: (value: number, currency: string = 'USD'): string => {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: currency
      }).format(value);
    },

    // 큰 숫자 (K, M, B)
    formatCompact: (value: number): string => {
      return new Intl.NumberFormat('ko-KR', {
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    }
  },

  // 날짜 포맷팅
  date: {
    // 기본 날짜
    format: (date: Date): string => {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    },

    // 날짜 + 시간
    formatWithTime: (date: Date): string => {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    },

    // 상대적 시간 (예: "3분 전")
    formatRelative: (date: Date): string => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}일 전`;
      if (hours > 0) return `${hours}시간 전`;
      if (minutes > 0) return `${minutes}분 전`;
      return `${seconds}초 전`;
    }
  }
};
