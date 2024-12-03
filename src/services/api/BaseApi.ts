import { ApiError, NetworkError, RateLimitError } from '../errors/ApiError';

export class BaseApi {
  protected async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new RateLimitError();
        }
        
        throw new ApiError(
          `API 요청 실패: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      
      if (data.error) {
        throw new ApiError(data.error.message, response.status, data.error.code);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new NetworkError();
      }

      throw new ApiError('알 수 없는 오류가 발생했습니다.');
    }
  }
} 