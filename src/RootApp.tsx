import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalTimeDetector from "./pages/global-time-detector";
import TimeGrid from "./pages/time-grid";
import Router from "./components/Router";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const routes = {
  "/": () => <TimeGrid />,
  "/detector": () => <GlobalTimeDetector />,
};

export default function RootApp() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-macos-monterey min-h-screen bg-cover bg-center p-2 pb-10 md:p-4">
        <div className="flex items-center justify-center gap-8 py-2">
          <button
            data-active={currentPath === "/"}
            className="rounded-lg bg-slate-600/10 px-4 py-1 transition active:scale-90 data-[active=true]:bg-slate-600/30"
            onClick={() => navigate("/")}
          >
            Time Grid
          </button>
          <button
            data-active={currentPath === "/detector"}
            className="rounded-lg bg-slate-600/10 px-4 py-1 transition active:scale-90 data-[active=true]:bg-slate-600/30"
            onClick={() => navigate("/detector")}
          >
            Detector
          </button>
        </div>
        <Router routes={routes} onRouteChange={setCurrentPath} />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
