import { useMemo, useRef, useState } from "react";

export function useLoading() {
  const [loadingCount, setLoadingCount] = useState(0);
  const loadingRef = useRef(0);

  const startLoading = useMemo(
    () =>
      async <T>(fn: () => Promise<T>): Promise<T> => {
        loadingRef.current += 1;
        setLoadingCount(loadingRef.current);

        try {
          return await fn();
        } finally {
          loadingRef.current -= 1;
          setLoadingCount(loadingRef.current);
        }
      },
    []
  );

  const isLoading = loadingCount > 0;

  return {
    isLoading,
    startLoading,
  };
}
