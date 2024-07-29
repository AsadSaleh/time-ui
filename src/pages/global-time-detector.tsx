import { timezoneList } from "../constants/timezone";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { GTD_TimezoneStaticInfo } from "../model/timezoneTime";
import CloseIcon from "../icons/ClosIcon";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GTDZustandStore = {
  text: string;
  setText: (text: string) => void;
};

const gtdStore = create(
  persist<GTDZustandStore>(
    (set) => ({
      text: "",
      setText: (text) => set({ text }),
    }),
    { name: "gtd-store" },
  ),
);

export default function GlobalTimeDetector() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-10 pt-10 md:pt-32">
      <section className="text-center">
        <h1 className="text-2xl md:text-5xl">Global Time Detector</h1>
        <p className="mt-2 text-lg text-slate-700">
          Input your datetime in the input below. It will autodetect the result!
        </p>
      </section>
      <section className="mx-auto mt-10 w-full md:w-1/2">
        <TimeCalculator />
      </section>
    </main>
  );
}

function TimeCalculator() {
  const { text: time, setText: setTime } = gtdStore();

  return (
    <section>
      <div className="relative">
        <input
          className="w-full rounded-xl border-4 border-slate-300 bg-white/40 p-4 backdrop-blur-md placeholder:tracking-widest placeholder:text-slate-700"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Input your datetime here..."
        />
        {true && (
          <button
            className="group absolute right-[14px] top-[14px] flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-slate-400 transition hover:bg-slate-600 active:scale-90"
            onClick={() => setTime("")}
          >
            <CloseIcon className="text-slate-600 group-hover:text-white" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {time === "" ? (
          <div>
            <div className="mt-2">
              <p className="text-slate-600">Example:</p>
              <ul className="list-inside list-disc">
                {[
                  "Sat Jan 6, 2024 12:59 AM CET",
                  "21/02/1999",
                  "2024/12/12",
                  "April 3, 2024 9:00 PM EST",
                ].map((example) => (
                  <li key={example}>
                    <button
                      className="cursor-pointer hover:font-semibold"
                      onClick={() => setTime(example)}
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Result time={time} />
        )}
      </div>
    </section>
  );
}

function Result({ time }: { time: string }) {
  const detectedDatetimeResult = detectDatetime(time);
  const status = detectedDatetimeResult.status;

  // Display error message if the datetime is invalid
  if (status === "error") {
    return (
      <p className="mt-4 text-lg">
        Sorry, I&apos;m not smart enough to understand that as a time
      </p>
    );
  }

  // Display error message if the datetime is invalid (NaN)
  const date = detectedDatetimeResult.data;

  if (date == null || isNaN(date.getTime())) {
    return (
      <p className="mt-4 text-lg">
        Sorry, I&apos;m not smart enough to understand that as a time
      </p>
    );
  }

  // Display the result (calcualte some variables first)
  const timezoneInfo = detectedDatetimeResult.timezoneInfo;

  const duration = intervalToDuration({
    start: new Date(),
    end: date,
  });

  const durationFromNow = formatDuration(duration, {
    format: ["years", "months", "days", "hours", "minutes"],
  });

  const distanceFromNow = formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true,
  });

  return (
    <div className="mt-6">
      <div className="mt-2 rounded-xl bg-white/20 p-4 backdrop-blur-md">
        <p className="text-2xl font-bold">Time Detected!</p>
        {timezoneInfo?.timezone ? (
          <p className="mt-4">
            The time is in&nbsp;
            <span className="font-bold">
              {timezoneInfo?.timezone} ({timezoneInfo?.abbreviation})
            </span>
          </p>
        ) : (
          <p>The time contains no timezone information</p>
        )}
        <p className="mt-2 text-2xl font-bold">
          {date.toLocaleDateString(undefined, {
            dateStyle: "full",
            timeZone: timezoneInfo?.timezone,
          })}
        </p>

        <p className="mt-1 text-xl font-bold">
          {date.toLocaleTimeString(undefined, {
            timeZone: timezoneInfo?.timezone,
          })}
        </p>
      </div>

      {/* In my local time */}
      <h4 className="mt-8 text-xl">Time information in your local time:</h4>

      <div className="mt-2 rounded-xl bg-white/20 p-4 backdrop-blur-lg">
        <p>
          Your timezone:{" "}
          <span className="font-bold">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </p>

        <p className="mt-2 text-2xl font-bold">
          {date.toLocaleDateString(undefined, { dateStyle: "full" })}
        </p>

        <p className="mt-1 text-xl font-bold">{date.toLocaleTimeString()}</p>

        {/* Relative to me */}
        <div className="mt-4">
          <p className="">Relative to you:</p>
          <p className="text-2xl font-bold">
            {upperCaseFirstLetter(distanceFromNow)}
          </p>
          <p>Exactly {durationFromNow}</p>
        </div>
      </div>
    </div>
  );
}

type DetectDateTimeResult =
  | {
      status: "success";
      data: Date;
      timezoneInfo?: GTD_TimezoneStaticInfo;
    }
  | { status: "error"; data: null };

// Detect datetime from a random string format
function detectDatetime(str: string): DetectDateTimeResult {
  try {
    const date = new Date(str);
    if (date instanceof Date && !isNaN(date.getTime())) {
      // Check if it contains timezone information
      const timezoneString = str.split(" ").at(-1);
      if (timezoneString == null) {
        return { status: "success", data: date };
      }
      const timezoneInfo = getTimezoneInfoFromCode(
        timezoneString.replace(/[^a-zA-Z]/g, "").toUpperCase(),
      );
      if (timezoneInfo) {
        return { status: "success", data: date, timezoneInfo };
      }
      return { status: "success", data: date };
    }

    // Try to detect date from a string with regex (YYYY-MM-DD)
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
    const dateMatch = str.match(dateRegex);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return { status: "success", data: new Date(`${year}-${month}-${day}`) };
    }

    // Try to detect date from a string with regex (DD/MM/YYYY)
    const dateRegex2 = /(\d{2})\/(\d{2})\/(\d{4})/;
    const dateMatch2 = str.match(dateRegex2);
    if (dateMatch2) {
      const [, day, month, year] = dateMatch2;
      return { status: "success", data: new Date(`${year}-${month}-${day}`) };
    }

    // Custom matcher for "Sat Jan 6, 2024 12:59 AM CET"
    // do it this way:
    // 1. match the timezone code
    const splittedString = str.split(" ");
    const dateStringWithoutTimezoneCode = splittedString.slice(0, -1).join(" ");
    const timezoneCode = splittedString.at(-1);

    if (!timezoneCode) {
      return { status: "error", data: null };
    }

    // 2. convert the timezone code to timezone offset
    const timezoneInfo = getTimezoneInfoFromCode(timezoneCode);

    // 3. use zonedTimeToUtc to convert to utc
    const utcDate = new Date(
      dateStringWithoutTimezoneCode.concat(timezoneInfo.utc_offset),
    );

    // 4. return the utc date
    return { status: "success", data: utcDate, timezoneInfo };
  } catch (e) {
    return { status: "error", data: null };
  }
}

const timezoneCodeToInfoMap: Record<string, GTD_TimezoneStaticInfo> = {};
function initializeTimezoneCodeToInfoMap() {
  for (const timezone of timezoneList) {
    timezoneCodeToInfoMap[timezone.abbreviation] = timezone;
  }
}

function getTimezoneInfoFromCode(timezoneCode: string) {
  initializeTimezoneCodeToInfoMap();
  return timezoneCodeToInfoMap[timezoneCode];
}

function upperCaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
