import { useEffect, useState } from "react";
import { getTimezoneTime } from "../api";

export default function CurrentCityCard() {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    let controller = new AbortController();

    getTimezoneTime("Asia/Jakarta", { controller })
      .then((res) => setClock(new Date(res.datetime)))
      .catch((err) => console.error(err));

    return () => {
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
    <div className="flex flex-col items-center bg-white/40 rounded-xl py-10 backdrop-blur">
      <div className="text-7xl">Jakarta</div>
      <p className="text-8xl">
        {clock.toLocaleTimeString("en-US", {
          timeZone: "Asia/Jakarta",
          hour12: false,
        })}
      </p>
      <p className="font-thin text-lg">Timezone: GMT+7</p>
    </div>
  );
}
