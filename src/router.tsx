import React, { useCallback, useEffect, useState } from "react";

type RouterContextValue = {
  pathname: string;
  navigate: (path: string) => void;
};

const RouterContext = React.createContext<RouterContextValue | null>(null);

export function Router({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    setPathname(path);
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = React.useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within Router");
  return ctx;
}

/** Get path param by name, e.g. useParams() for /post/:id returns { id } */
export function useParams(): Record<string, string> {
  const { pathname } = useRouter();
  const match = pathname.match(/^\/post\/([^/]+)$/);
  if (match) return { id: match[1] };
  return {};
}

interface LinkProps {
  to: string;
  params?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  "data-ocid"?: string;
}

/** Link that navigates without full page reload. Supports to="/post/$id" and params={{ id: "1" }} */
export function Link({ to, params, children, className, "data-ocid": dataOcid }: LinkProps) {
  const { navigate } = useRouter();
  const path = params
    ? Object.entries(params).reduce(
        (p, [key, value]) => p.replace("$" + key, value),
        to
      )
    : to;

  return (
    <a
      href={path}
      className={className}
      data-ocid={dataOcid}
      onClick={(e) => {
        e.preventDefault();
        navigate(path);
      }}
    >
      {children}
    </a>
  );
}
