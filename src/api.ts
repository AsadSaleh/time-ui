import { TimezoneTime } from "./model/timezoneTime";

interface ApiConfig {
  controller?: AbortController;
}

// export async function getTimezones(): Promise<String[]> {
//   try {
//     const res = await fetch("https://worldtimeapi.org/api").then((r) => {
//       if (!r.ok) {
//         throw new Error(r.statusText);
//       }
//       return r.json() as Promise<String[]>;
//     });
//     console.log({ res });
//     return res;
//   } catch (error) {
//     console.log("error? ", error);
//     throw error;
//   }
// }

export async function getTimezoneTime(
  path: string,
  config?: ApiConfig
): Promise<TimezoneTime> {
  try {
    const res = await fetch(`https://worldtimeapi.org/api/timezone/${path}`, {
      signal: config?.controller?.signal,
    }).then((r) => {
      if (!r.ok) {
        throw new Error(r.statusText);
      }
      return r.json() as Promise<TimezoneTime>;
    });
    console.log({ res });
    return res;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
