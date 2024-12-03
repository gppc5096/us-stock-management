export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = '네트워크 연결에 실패했습니다.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'API 호출 한도를 초과했습니다.') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
} 