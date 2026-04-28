import { RefObject, useEffect, useState } from 'react';

export function useResponsiveChartWidth(
  containerRef: RefObject<HTMLElement | null>,
  preferredWidth: number,
): number {
  const [chartWidth, setChartWidth] = useState(preferredWidth);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const nextWidth = Math.floor(element.clientWidth || preferredWidth);
      setChartWidth(Math.max(240, Math.min(preferredWidth, nextWidth)));
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef, preferredWidth]);

  return chartWidth;
}
