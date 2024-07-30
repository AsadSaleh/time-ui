import { useState, useEffect, ReactNode } from "react";

const Router = ({
  routes,
  onRouteChange,
}: {
  onRouteChange: (v: string) => void;
  routes: Record<string, () => ReactNode>;
}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
      if (onRouteChange) {
        onRouteChange(window.location.pathname);
      }
    };

    window.addEventListener("popstate", onLocationChange);

    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [onRouteChange]);

  const RouteComponent = routes[currentPath] || routes["/404"];

  return <RouteComponent />;
};

export default Router;
