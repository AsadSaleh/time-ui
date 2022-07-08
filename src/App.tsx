import React, { useEffect, useState } from "react";

function App() {
  async function getTimezones() {
    try {
      const res = await fetch("http://worldtimeapi.org/api");
      const json = await res.json();
      console.log("json? ", json);
    } catch (error) {
      console.log("error? ", error);
    }
  }
  useEffect(() => {});
  return (
    <div className="p-4 flex flex-col justify-center h-screen">
      <CurrentCityCard />
      <div className="h-14" />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-4">
        <CityCard
          city="Sydney"
          label="My Friend Hanggi"
          timeDiff={6}
          timezoneCode="AER"
        />
        <CityCard city="Sydney" timeDiff={6} timezoneCode="AER" />
        <CityCard
          city="Sydney"
          label="Maybe my next city"
          timeDiff={6}
          timezoneCode="AER"
        />
        <NewCity />
      </div>
    </div>
  );
}

function CurrentCityCard() {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    let controller = new AbortController();

    async function getCurrentTimezoneTime(): Promise<TimezoneTime | null> {
      try {
        const res = await fetch(
          "https://worldtimeapi.org/api/timezone/Asia/Jakarta",
          {
            signal: controller.signal,
          }
        ).then((r) => {
          if (!r.ok) {
            throw new Error(r.statusText);
          }
          return r.json() as Promise<TimezoneTime>;
        });
        console.log({ res });
        return res;
      } catch (error) {
        console.log({ error });
        return null;
      }
    }

    getCurrentTimezoneTime();

    return () => {
      // clean up func
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setClock(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-7xl">Jakarta</div>
      <p className="text-8xl">
        {clock.getHours()}:{clock.getMinutes().toString().padStart(2, "0")}:
        {clock.getSeconds().toString().padStart(2, "0")}
      </p>
    </div>
  );
}

interface CityCardProps {
  city: string;
  label?: string;
  timezoneCode: string;
  timeDiff: number;
}

function CityCard(props: CityCardProps) {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    // set timer
    const intervalId = setInterval(() => {
      // function to increment clock
      setClock(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  });

  let text = "";
  if (props.timeDiff === 0) {
    text = "The same with Jakarta";
  } else if (props.timeDiff > 0) {
    text = `${props.timeDiff} hours ahead Jakarta`;
  } else {
    text = `${props.timeDiff} hours behind Jakarta`;
  }
  return (
    <div className="bg-stone-300 rounded-xl flex flex-col justify-center items-center py-6">
      <h4 className="text-3xl">{props.city}</h4>
      <p className="text-lg italic">{props.label ?? "-"}</p>

      <p className="text-4xl mt-4">
        {clock.getHours()}:{clock.getMinutes().toString().padStart(2, "0")}
      </p>

      <p>Timezone: {props.timezoneCode}</p>
      <p className="text-center mt-4">{text}</p>
    </div>
  );
}

function NewCity() {
  return (
    <div className="bg-stone-200 rounded-xl flex flex-col justify-center items-center hover:border-stone-700 border-2 border-solid cursor-pointer">
      <div className="text-3xl">+</div>
      <div className="text-sm italic">Add City</div>
    </div>
  );
}

function AddCityForm() {
  const url = "http://worldtimeapi.org/api/timezone";
  return (
    <div>
      <form>
        <select>
          <option value={"hehe"}>Test</option>
        </select>
      </form>
    </div>
  );
}

export default App;

export interface TimezoneTime {
  abbreviation: string;
  client_ip: string;
  datetime: Date | string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: null;
  dst_offset: number;
  dst_until: null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: Date | string;
  utc_offset: string;
  week_number: number;
}
