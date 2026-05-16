import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

/**
 * Persists a piece of state to AsyncStorage so it survives navigation.
 * Restores on mount, saves on every change.
 */
export function useActivityDraft<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const readyRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((raw) => {
      if (raw) {
        try { setValue(JSON.parse(raw)); } catch {}
      }
      readyRef.current = true;
    });
  }, [key]);

  useEffect(() => {
    if (!readyRef.current) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);

  const clear = () => AsyncStorage.removeItem(key).catch(() => {});

  return [value, setValue, clear] as const;
}
