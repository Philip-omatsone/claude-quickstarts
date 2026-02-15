import { useState, useEffect, useCallback } from 'react';

export function useApiKey(): { hasKey: boolean; getKey: () => string | null } {
  const [hasKey, setHasKey] = useState(() => !!localStorage.getItem('claude_api_key'));

  useEffect(() => {
    function onChanged() {
      setHasKey(!!localStorage.getItem('claude_api_key'));
    }
    window.addEventListener('apikey-changed', onChanged);
    return () => window.removeEventListener('apikey-changed', onChanged);
  }, []);

  const getKey = useCallback(() => localStorage.getItem('claude_api_key'), []);

  return { hasKey, getKey };
}
