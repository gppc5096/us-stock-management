import { useState, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  ttl: number; // Time To Live in milliseconds
  maxSize: number; // Maximum number of items in cache
}

export function useApiCache<T>(config: CacheConfig = { ttl: 60000, maxSize: 100 }) {
  const [cache] = useState<Map<string, CacheItem<T>>>(new Map());

  const get = useCallback((key: string): T | null => {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > config.ttl) {
      cache.delete(key);
      return null;
    }

    return item.data;
  }, [cache, config.ttl]);

  const set = useCallback((key: string, data: T) => {
    if (cache.size >= config.maxSize) {
      // LRU: Remove oldest item
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [cache, config.maxSize]);

  const clear = useCallback(() => {
    cache.clear();
  }, [cache]);

  return { get, set, clear };
} 