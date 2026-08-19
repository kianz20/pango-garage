import { useEffect, useState, useCallback } from 'react';

/**
 * A ~20 line router. Three routes and no query strings do not justify a dependency.
 */
export function navigate(to, { replace = false } = {}) {
  if (replace) window.history.replaceState({}, '', to);
  else window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute() {
  const read = useCallback(() => window.location.pathname, []);
  const [path, setPath] = useState(read);

  useEffect(() => {
    const onPop = () => setPath(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [read]);

  // /j/ABCD -> { name: 'join', code: 'ABCD' }
  const joinMatch = path.match(/^\/j\/([A-Za-z0-9]{1,8})\/?$/);
  if (joinMatch) return { name: 'join', code: joinMatch[1].toUpperCase(), path };
  if (/^\/host\/?$/.test(path)) return { name: 'host', path };
  if (/^\/join\/?$/.test(path)) return { name: 'join', code: '', path };
  return { name: 'landing', path };
}
