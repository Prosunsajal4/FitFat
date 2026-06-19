import { useState, useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll(fetchMore, hasMore) {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try { await fetchMore(); } finally { setLoading(false); }
  }, [fetchMore, hasMore, loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );

    observerRef.current.observe(sentinel);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  return { sentinelRef, loading };
}
