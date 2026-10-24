'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from './api';

export interface ApiState<T> {
  data: T | undefined;
  error: ApiError | undefined;
  loading: boolean;
  reload: () => void;
  setData: (data: T) => void;
}

/** GETs `path` (null skips the request) and re-fetches on reload(). */
export function useApi<T>(path: string | null): ApiState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError>();
  const [loading, setLoading] = useState(path !== null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (path === null) return;
    let live = true;
    setLoading(true);
    api<T>(path)
      .then((d) => {
        if (!live) return;
        setData(d);
        setError(undefined);
      })
      .catch((e: unknown) => {
        if (live) setError(e instanceof ApiError ? e : new ApiError(0, { message: String(e) }));
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { data, error, loading, reload, setData };
}
