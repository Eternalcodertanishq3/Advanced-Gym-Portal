import { useEffect, useRef, useState } from 'react';
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
}