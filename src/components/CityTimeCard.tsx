import { useQuery } from "@tanstack/react-query";
import useGlobalClock from "../hooks/useGlobalClock";
import TrashIcon from "../icons/Trash";
import { getTimezoneTime } from "../api";
import { fromUnderscoreToPascal, getCityFromTzName } from "../helper";

interface CityTimeCardProps {
  location: string;
  label?: string;
  onDelete?: () => void;
}

export default function CityTimeCard(props: CityTimeCardProps) {
  const { location } = props;

  const timeQuery = useQuery({
    queryKey: ["time", "detail", location],
    queryFn: () => getTimezoneTime(location),
  });

  const timeData = timeQuery.data?.data ?? null;

  const usersTimezoneUtcOffset = new Date().getTimezoneOffset() / -60;

  // Calculate offset.
  const offsetFromUtc = Number(timeData?.utc_offset?.split(":")[0] ?? "0");
  const offsetFromCurrentTimezone = offsetFromUtc - usersTimezoneUtcOffset;
  let offsetText = "";
  if (offsetFromCurrentTimezone === 0) {
    offsetText = "The same with you";
  } else if (offsetFromCurrentTimezone > 0) {
    offsetText = `${offsetFromCurrentTimezone} hours ahead of you`;
  } else {
    offsetText = `${Math.abs(offsetFromCurrentTimezone)} hours behind you`;
  }

  // Calculate derived values.
  const clock = timeData?.datetime ? new Date(timeData?.datetime) : null;
  const abbreviation = timeData?.abbreviation;
  const city = timeData?.timezone ? getCityFromTzName(timeData.timezone) : "";

  // Format city name before display:
  const formattedCity = fromUnderscoreToPascal(city);

  return (
    <div className="group bg-stone-300 rounded-xl flex flex-col justify-center items-center py-6 relative bg-white/40 backdrop-blur">
      <div
        onClick={() => props.onDelete?.()}
        className="bg-stone-100/40 hover:bg-stone-100 transition-all ease-in-out group-hover:block absolute hidden right-2 top-2 cursor-pointer p-1 rounded-lg"
      >
        <TrashIcon className="text-red-200" />
      </div>
      <h4 className="text-3xl">{formattedCity}</h4>
      <p className="text-lg italic">{props.label ?? "-"}</p>

      {clock && <TickingClock timezone={props.location} />}

      <p className="text-center">Timezone: {abbreviation}</p>
      <p className="text-center mt-4 text-black/60">{offsetText}</p>
    </div>
  );
}

// Inner component to render the ticking clock.
function TickingClock({ timezone }: { timezone: string }) {
  // Connect with GlobalClock to get the ticking effect.
  useGlobalClock((state) => state.count);

  const date = new Date();

  return (
    <p className="text-2xl md:text-3xl lg:text-4xl xl:text-6xl mt-4 font-mono italic text-center">
      {date.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: true,
      })}
    </p>
  );
}
