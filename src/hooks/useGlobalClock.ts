import { create } from "zustand";

interface GlobalClock {
  count: number;
  increase: () => void;
}

const useGlobalClock = create<GlobalClock>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}));

export default useGlobalClock;
