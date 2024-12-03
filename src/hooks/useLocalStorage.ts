import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 초기값을 가져오는 함수를 메모이제이션
  const getInitialValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // 값을 설정하는 함수
  const setValue = (value: T) => {
    try {
      // 새 값을 상태에 저장
      setStoredValue(value);
      // 새 값을 localStorage에 저장
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // key나 initialValue가 변경될 때 실행
  useEffect(() => {
    setStoredValue(getInitialValue());
  }, [getInitialValue]); // getInitialValue가 변경될 때만 실행

  return [storedValue, setValue];
}
