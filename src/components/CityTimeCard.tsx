import useFetchTimezone from "../hooks/useFetchTimezone";
import useTickingClock from "../hooks/useTickingClock";
import TrashIcon from "../icons/Trash";

interface CityTimeCardProps {
  location: string;
  label?: string;
  onDelete?: () => void;
}

export default function CityTimeCard(props: CityTimeCardProps) {
  const { clock, abbreviation, offsetFromCurrentTimezone, city } =
    useFetchTimezone(props.location);

  let text = "";
  if (offsetFromCurrentTimezone === 0) {
    text = "The same with Jakarta";
  } else if (offsetFromCurrentTimezone > 0) {
    text = `${offsetFromCurrentTimezone} hours ahead Jakarta`;
  } else {
    text = `${Math.abs(offsetFromCurrentTimezone)} hours behind Jakarta`;
  }

  // Format city name before display:
  let formattedCity = city;
  if (city?.includes("_")) {
    formattedCity = city.split("_").join(" ");
  }
  return (
    <div className="group bg-stone-300 rounded-xl flex flex-col justify-center items-center py-6 relative bg-white/40 backdrop-blur">
      <div
        onClick={() => props.onDelete?.()}
        className="bg-stone-700 group-hover:block absolute hidden right-2 top-2 cursor-pointer p-1 rounded-xl"
      >
        <TrashIcon className="text-red-200" />
      </div>
      <h4 className="text-3xl">{formattedCity}</h4>
      <p className="text-lg italic">{props.label ?? "-"}</p>

      {clock && <TickingClock initialDate={clock} timezone={props.location} />}

      <p className="font-thin">Timezone: {abbreviation}</p>
      <p className="text-center mt-4">{text}</p>
    </div>
  );
}

// Inner component to render the ticking clock
function TickingClock({
  initialDate,
  timezone,
}: {
  initialDate: Date;
  timezone: string;
}) {
  const clock = useTickingClock(initialDate);

  return (
    <p className="text-4xl mt-4">
      {clock.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: false,
      })}
    </p>
  );
}
