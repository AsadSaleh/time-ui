import { TimezoneTime } from "../model/timezoneTime";

type ErrorResponse = {
  error: string;
  data: null;
};
type DataResponse<T> = {
  error: null;
  data: T;
};

/**
 * Fetch all of available timezones.
 * Example: ["Africa/Abidjan","Africa/Algiers,...]
 */
export async function getTimezones(): Promise<
  ErrorResponse | DataResponse<string[]>
> {
  const res = await fetch("https://worldtimeapi.org/api/timezone");
  if (!res.ok) {
    return { error: "Failed to fetch", data: null };
  }
  const json = await res.json();
  return { error: null, data: json };
}

/**
 * Fetch the "time" detail of a single timezone.
 */
export async function getTimezoneTime(
  timezone: string,
): Promise<ErrorResponse | DataResponse<TimezoneTime>> {
  const res = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
  if (!res.ok) {
    return { error: "Failed to fetch", data: null };
  }
  const json = await res.json();
  return { error: null, data: json };
}
