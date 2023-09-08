import { useEffect, useState } from "react";
import { getTimezoneTime } from "../api";
import { TimezoneTime } from "../model/timezoneTime";

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
  }, [location]);

  const usersTimezoneUtcOffset = new Date().getTimezoneOffset() / -60;

  // Calculate offset:
  const offsetFromUtc = Number(timeData?.utc_offset?.split(":")[0] ?? "0");
  const offsetFromCurrentTimezone = offsetFromUtc - usersTimezoneUtcOffset;

  return {
    isLoading: !!timeData,
    clock: timeData?.datetime ? new Date(timeData?.datetime) : null,
    abbreviation: timeData?.abbreviation,
    offsetFromUtc,
    offsetFromCurrentTimezone,
    city: timeData?.timezone?.split("/")[1],
  };
}
