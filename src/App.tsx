import { uniqueId } from "lodash";
import { useEffect, useState } from "react";
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
    <div className="p-4 flex flex-col justify-center">
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
          <NewCity
            onSubmit={(v) => {
              setCities((prevCities) => prevCities.concat(v));
            }}
          />
        )}
      </div>
    </div>
  );
}

function NewCity({ onSubmit }: { onSubmit: (v: ClockDisplayProps) => void }) {
  const [isFormMode, setFormMode] = useState(false);
  if (isFormMode) {
    return (
      <AddCityForm
        onSubmit={(v) => {
          setFormMode(false);
          onSubmit(v);
        }}
        onCancel={() => setFormMode(false)}
      />
    );
  }
  return (
    <div
      onClick={() => setFormMode(true)}
      className="bg-stone-200 py-4 rounded-xl flex flex-col justify-center items-center hover:border-stone-700 border-2 border-solid cursor-pointer"
    >
      <p className="text-3xl leading-3 ">+</p>
      <div className="h-2" />
      <p className="text-sm italic">Add City</p>
    </div>
  );
}

function AddCityForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (v: ClockDisplayProps) => void;
}) {
  return (
    <div className="bg-stone-200 py-4 rounded-xl flex flex-col justify-center items-center hover:border-stone-700 border-2 border-solid">
      <form
        className="w-5/6"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const formObj = Object.fromEntries(data) as {
            label: string;
            location: string;
          };
          onSubmit({
            id: uniqueId().toString(),
            ...formObj,
          });
        }}
      >
        <p className="block text-sm font-medium text-slate-700">Add City</p>
        <div className="mt-2">
          <select
            name="location"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
         focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-600
         disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
         
         
       "
          >
            <option value={""}>Choose a city</option>
            {Object.keys(ALLOWED_CITIES_MAP).map((key) => {
              return (
                <option
                  key={key}
                  value={
                    ALLOWED_CITIES_MAP[key as keyof typeof ALLOWED_CITIES_MAP]
                  }
                >
                  {key}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <input
            type="text"
            name="label"
            maxLength={20}
            placeholder="Add a label"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-600
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      
    "
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-2  mt-4 ">
          <button
            type="button"
            onClick={() => onCancel()}
            className="hover:text-black text-stone-500"
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 rounded-xl bg-stone-500 hover:bg-stone-600 active:bg-stone-700 focus:outline-none focus:ring focus:ring-stone-300 text-stone-100"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

const ALLOWED_CITIES_MAP = {
  Singapore: "Asia/Singapore",
  Tokyo: "Asia/Tokyo",
  Seoul: "Asia/Seoul",
  Melbourne: "Australia/Melbourne",
  Sydney: "Australia/Sydney",
  London: "Europe/London",
  Paris: "Europe/Paris",
  Berlin: "Europe/Berlin",
  "New York": "America/New_York",
  "Los Angeles": "America/Los_Angeles",
};

export default App;
