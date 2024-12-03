import { useState, useEffect } from 'react';
import LZString from 'lz-string';

export function useLocalStorageWithCompression<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const decompressed = LZString.decompress(item);
        return decompressed ? JSON.parse(decompressed) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error('LocalStorage 읽기 오류:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const compressed = LZString.compress(JSON.stringify(storedValue));
      window.localStorage.setItem(key, compressed);
    } catch (error) {
      console.error('LocalStorage 쓰기 오류:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
} 