import { useEffect } from "react";
import AddCityCard from "../components/AddCityCard";
import CityTimeCard from "../components/CityTimeCard";
import CurrentCityCard from "../components/CurrentCity";
import useGlobalClock from "../hooks/useGlobalClock";
import { persist } from "zustand/middleware";

import { create } from "zustand";

interface ClockDisplayProps {
  id: string;
  location: string;
  label?: string;
}

type TimeGridZustandStore = {
  cities: ClockDisplayProps[];
  addCity: (city: ClockDisplayProps) => void;
  removeCity: (id: string) => void;
  editCity: (id: string, location: string, label?: string) => void;
};

const timeGridStore = create(
  persist<TimeGridZustandStore>(
    (set) => ({
      cities: [] as ClockDisplayProps[],
      addCity: (city: ClockDisplayProps) =>
        set((state) => ({ cities: [...state.cities, city] })),
      removeCity: (id: string) =>
        set((state) => ({
          cities: state.cities.filter((city) => city.id !== id),
        })),
      editCity: (id: string, location: string, label?: string) =>
        set((state) => ({
          cities: state.cities.map((city) =>
            city.id === id ? { ...city, location, label } : city,
          ),
        })),
    }),
    { name: "time-grid-store" },
  ),
);

export default function TimeGrid() {
  const { cities, addCity, removeCity, editCity } = timeGridStore();

  const increase = useGlobalClock((state) => state.increase);

  // Setup timer for global clock
  useEffect(() => {
    const timerId = setInterval(() => {
      increase();
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  });

  return (
    <main className="min-h-screen bg-cover p-2 pb-10 md:p-4">
      <CurrentCityCard />

      <div className="mt-2 grid grid-cols-2 place-content-center gap-2 md:mt-3 md:grid-cols-2 md:gap-3 lg:mt-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
        {cities.map((city) => (
          <CityTimeCard
            key={city.id}
            id={city.id}
            location={city.location}
            label={city.label}
            onDelete={() => {
              const propmt = window.confirm(
                "Are you sure you want to delete this city?",
              );
              if (!propmt) return;
              removeCity(city.id);
            }}
            onEdit={(id, location, label = "") => editCity(id, location, label)}
          />
        ))}
        <AddCityCard onSubmit={(v) => addCity(v)} />
      </div>

      {/* Credit to myself */}
      <footer className="fixed bottom-2 right-2">
        <a
          href="https://asadghanim.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-transparent/10 p-1 text-xs transition-all hover:bg-transparent/20"
        >
          By As&apos;ad Ghanim
        </a>
      </footer>
    </main>
  );
}
