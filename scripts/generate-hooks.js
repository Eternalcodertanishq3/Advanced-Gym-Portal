const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '../src/hooks');
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

const queries = [
  'members', 'payments', 'attendance', 'trainers', 'classes', 'subscriptions', 'notifications', 'analytics'
];

queries.forEach(q => {
  const code = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function use${q.charAt(0).toUpperCase() + q.slice(1)}() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['${q}'],
    queryFn: async () => {
      // Replace with actual API call
      const res = await fetch('/api/${q}');
      return res.json();
    }
  });

  return { ...query };
}
`;
  fs.writeFileSync(path.join(hooksDir, `use-${q}.ts`), code);
});

const uiHooks = {
  'use-debounce': `import { useState, useEffect } from 'react';
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}`,
  'use-local-storage': `import { useState } from 'react';
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}`,
  'use-media-query': `import { useState, useEffect } from 'react';
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
}`,
  'use-intersection-observer': `import { useEffect, useRef, useState } from 'react';
export function useIntersectionObserver(options = {}) {
  const elementRef = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    if (elementRef.current) observer.observe(elementRef.current);
    return () => { if (elementRef.current) observer.unobserve(elementRef.current); };
  }, [options]);
  return [elementRef, isIntersecting] as const;
}`,
  'use-online-status': `import { useState, useEffect } from 'react';
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);
  return isOnline;
}`,
  'use-copy-to-clipboard': `import { useState } from 'react';
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copy = async (text: string) => {
    if (!navigator?.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      setCopiedText(null);
      return false;
    }
  };
  return [copiedText, copy] as const;
}`
};

Object.entries(uiHooks).forEach(([name, code]) => {
  fs.writeFileSync(path.join(hooksDir, name + '.ts'), code);
});

console.log('Hooks generated successfully.');
