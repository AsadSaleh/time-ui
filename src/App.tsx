import { useEffect, useState } from "react";
import AddCityCard from "./components/AddCityCard";
import CityTimeCard from "./components/CityTimeCard";
import CurrentCityCard from "./components/CurrentCity";

interface ClockDisplayProps {
  id: string;
  location: string;
  label?: string;
}

function App() {
  const [cities, setCities] = useState<ClockDisplayProps[]>(() => {
    const cities = JSON.parse(localStorage.getItem("cities") ?? "[]");
    return cities;
  });

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  return (
    <div className="p-4 flex flex-col justify-center bg-macos-monterey bg-cover h-screen w-full">
      <CurrentCityCard />
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
        {cities.length < 4 && (
          <AddCityCard
            onSubmit={(v) => {
              setCities((prevCities) => prevCities.concat(v));
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
