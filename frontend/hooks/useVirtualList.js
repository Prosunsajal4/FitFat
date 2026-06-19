import { useState, useEffect } from 'react';

export function useVirtualList(items, itemHeight = 50, containerHeight = 400) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;

  const onScroll = (e) => setScrollTop(e.target.scrollTop);

  return { visibleItems, totalHeight, onScroll, startIndex, endIndex };
}
