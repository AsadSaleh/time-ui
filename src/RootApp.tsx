import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import App from "./App";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import GlobalTimeDetector from "./pages/global-time-detector";
import TimeGrid from "./pages/time-grid";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

export default function RootApp() {
  const [route, setRoute] = useState("time-grid");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-macos-monterey min-h-screen bg-cover bg-center p-2 pb-10 md:p-4">
        <div className="flex items-center justify-center gap-8 py-2">
          <button
            data-active={route === "time-grid"}
            className="rounded-lg bg-slate-600/10 px-4 py-1 transition active:scale-90 data-[active=true]:bg-slate-600/30"
            onClick={() => setRoute("time-grid")}
          >
            Time Grid
          </button>
          <button
            data-active={route === "detector"}
            className="rounded-lg bg-slate-600/10 px-4 py-1 transition active:scale-90 data-[active=true]:bg-slate-600/30"
            onClick={() => setRoute("detector")}
          >
            Detector
          </button>
        </div>
        {route === "time-grid" ? (
          <TimeGrid />
        ) : route === "detector" ? (
          <GlobalTimeDetector />
        ) : null}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
