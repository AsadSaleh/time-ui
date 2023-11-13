import { getCityFromTzName } from "../helper";
import useGlobalClock from "../hooks/useGlobalClock";

export default function CurrentCityCard() {
  useGlobalClock((state) => state.count);

  const clock = new Date();

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const city = getCityFromTzName(timeZone);

  return (
    <div className="flex flex-col items-center bg-white/40 rounded-xl py-8 backdrop-blur">
      <div className="text-2xl md:text-7xl">{city}</div>
      <p className="text-3xl md:text-8xl font-mono italic">
        {clock.toLocaleTimeString("en-US", {
          hour12: false,
        })}
      </p>
      <p className="font-normal text-lg text-center">Timezone: {timeZone}</p>
    </div>
  );
}
