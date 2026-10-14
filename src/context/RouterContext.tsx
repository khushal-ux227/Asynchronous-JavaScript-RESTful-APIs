import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type AppRoute =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'orders'
  | 'deployment';

interface RouteState {
  route: AppRoute;
  params: Record<string, string>;
  query: Record<string, string>;
  rawPath: string;
}

interface RouterContextValue extends RouteState {
  navigate: (path: string) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parsePath(fullHashOrPath: string): RouteState {
  let clean = fullHashOrPath.replace(/^#\/?/, '').trim();
  if (!clean || clean === '/') {
    return { route: 'home', params: {}, query: {}, rawPath: '/' };
  }

  const [pathPart, queryPart] = clean.split('?');
  const query: Record<string, string> = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  const segments = pathPart.split('/').filter(Boolean);
  const root = segments[0] || 'home';

  if (root === 'catalog') {
    return { route: 'catalog', params: {}, query, rawPath: `/${pathPart}` };
  }

  if (root === 'product' && segments[1]) {
    return {
      route: 'product-detail',
      params: { idOrSlug: segments[1] },
      query,
      rawPath: `/${pathPart}`,
    };
  }

  if (root === 'cart') {
    return { route: 'cart', params: {}, query, rawPath: `/${pathPart}` };
  }

  if (root === 'checkout') {
    return { route: 'checkout', params: {}, query, rawPath: `/${pathPart}` };
  }

  if (root === 'order-confirmation' && segments[1]) {
    return {
      route: 'order-confirmation',
      params: { orderId: segments[1] },
      query,
      rawPath: `/${pathPart}`,
    };
  }

  if (root === 'orders') {
    return { route: 'orders', params: {}, query, rawPath: `/${pathPart}` };
  }

  if (root === 'deployment' || root === 'architecture') {
    return { route: 'deployment', params: {}, query, rawPath: `/${pathPart}` };
  }

  return { route: 'home', params: {}, query, rawPath: '/' };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<RouteState>(() => {
    return parsePath(window.location.hash || window.location.pathname);
  });

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parsePath(window.location.hash || window.location.pathname);
      setCurrent(parsed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    const formatted = path.startsWith('#') ? path : `#${path.startsWith('/') ? '' : '/'}${path}`;
    window.location.hash = formatted;
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/catalog');
    }
  }, [navigate]);

  return (
    <RouterContext.Provider value={{ ...current, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}
