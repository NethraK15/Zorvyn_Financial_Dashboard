/**
 * useApi — generic React hook for calling the mock API
 * 
 * Usage:
 *   const { data, loading, error, refetch } = useApi(api.getDashboardSummary);
 *   const { execute, loading } = useApiMutation(api.createTransaction);
 */

import { useState, useEffect, useCallback } from "react";

/**
 * For GET-style calls that run on mount (and optionally on arg changes).
 * @param {Function} apiFn   - async function returning { success, data }
 * @param {any[]}    args    - spread-passed as arguments to apiFn
 */
export function useApi(apiFn, args = [], options = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const execute = useCallback(async (...callArgs) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...(callArgs.length ? callArgs : args));
      setData(result.data);
      setLastUpdated(new Date());
      return result.data;
    } catch (e) {
      setError(e?.message || "An unexpected error occurred.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn, JSON.stringify(args)]); // eslint-disable-line

  useEffect(() => {
    if (immediate) execute();
  }, [immediate]); // eslint-disable-line

  return { data, loading, error, refetch: execute, lastUpdated };
}

/**
 * For mutation-style calls (POST / PATCH / DELETE) triggered manually.
 * @param {Function} apiFn  - async API function
 */
export function useApiMutation(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result.data);
      return result.data;
    } catch (e) {
      setError(e?.message || "Something went wrong.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { execute, loading, error, data };
}
