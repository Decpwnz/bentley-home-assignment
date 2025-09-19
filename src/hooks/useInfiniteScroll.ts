import { useEffect, useRef, useCallback } from "react";
import type { UseInfiniteScrollProps } from "../types";

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 200,
}: UseInfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && !loading && hasMore) {
        onLoadMore();
      }
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, threshold]);

  return sentinelRef;
};
