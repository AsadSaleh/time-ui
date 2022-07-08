import { useEffect, useState } from "react";
import { getTimezoneTime } from "../../api";
import { TimezoneTime } from "../../model";

export default function useFetchTimezone(location: string) {
  const [timeData, setTimeData] = useState<TimezoneTime | null>(null);

  useEffect(() => {
    let controller = new AbortController();

    getTimezoneTime(location, { controller })
      .then((res) => setTimeData(res))
      .catch((err) => console.error(err));

    return () => {
      controller.abort();
    };
  }, []);

  // useEffect(() => {
  //   // set timer
  //   const intervalId = setInterval(() => {
  //     // function to increment clock
  //     setClock(new Date());
  //   }, 1000);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  // Calculate offset:
  const offsetFromUtc = Number(timeData?.utc_offset?.split(":")[0] ?? "0");
  const offsetFromCurrentTimezone = offsetFromUtc - 7;

  // print clock:
  console.log("datetime? ", timeData?.datetime);

  return {
    isLoading: !!timeData,
    clock: new Date(timeData?.datetime ?? ""),
    abbreviation: timeData?.abbreviation,
    offsetFromUtc,
    offsetFromCurrentTimezone,
    city: timeData?.timezone?.split("/")[1],
  };
}
