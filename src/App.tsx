import { useEffect } from "react";
import AddCityCard from "./components/AddCityCard";
import CityTimeCard from "./components/CityTimeCard";
import CurrentCityCard from "./components/CurrentCity";
import useGlobalClock from "./hooks/useGlobalClock";

import useStoredState from "./hooks/useStoredState";

interface ClockDisplayProps {
  id: string;
  location: string;
  label?: string;
}

function App() {
  const [cities, setCities] = useStoredState<ClockDisplayProps[]>([]);

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
    <div className="bg-macos-monterey bg-cover min-h-screen p-4">
      <CurrentCityCard />
      {cities.length === 0 ? (
        <div className="grid mt-14 grid-cols-1 gap-2 place-content-center">
          <AddCityCard
            onSubmit={(v) => {
              setCities((prevCities) => prevCities.concat(v));
            }}
          />
        </div>
      ) : (
        <div className="grid mt-14 grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-4 place-content-center">
          {cities.map((city) => (
            <CityTimeCard
              key={city.id}
              location={city.location}
              label={city.label}
              onDelete={() =>
                setCities((prevCities) =>
                  prevCities.filter((pCity) => pCity.id !== city.id)
                )
              }
            />
          ))}
          <AddCityCard
            onSubmit={(v) => {
              setCities((prevCities) => prevCities.concat(v));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
