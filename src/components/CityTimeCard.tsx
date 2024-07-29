import { useQuery } from "@tanstack/react-query";
import useGlobalClock from "../hooks/useGlobalClock";
import TrashIcon from "../icons/Trash";
import { getTimezoneTime } from "../services/timezoneApi";
import { fromUnderscoreToPascal, getCityFromTzName } from "../helper";
import EditIcon from "../icons/Edit";
import { useState } from "react";
import { AddCityForm } from "./AddCityCard";
import { ClockDisplay } from "../model/clockDisplay";

interface CityTimeCardProps {
  id: string;
  location: string;
  label?: string;
  onDelete?: () => void;
  onEdit?: (id: string, location: string, label?: string) => void;
}

export default function CityTimeCard({
  location,
  id,
  label,
  onDelete,
  onEdit,
}: CityTimeCardProps) {
  const [isEditing, setIsEditing] = useState(false);

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

  // Create text like "UTC+7" or "UTC-9":
  const timezoneUtcOffsetText = `UTC${
    offsetFromUtc >= 0 ? `+${offsetFromUtc}` : offsetFromUtc
  }`;

  if (isEditing) {
    return (
      <AddCityForm
        initialValue={{ id, location, label }}
        onCancel={() => {
          setIsEditing(false);
        }}
        onSubmit={(v: ClockDisplay) => {
          onEdit?.(id, v.location, v.label);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="group relative flex flex-col items-center justify-center rounded-xl bg-stone-300 bg-white/40 px-2 py-6 backdrop-blur md:px-4">
      <button
        type="button"
        onClick={() => onDelete?.()}
        className="absolute right-2 top-2 hidden cursor-pointer rounded-lg bg-stone-100/40 p-1 transition-all ease-in-out hover:bg-stone-100 group-hover:block"
      >
        <TrashIcon className="text-red-200" />
      </button>

      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="absolute left-2 top-2 hidden cursor-pointer rounded-lg bg-stone-100/40 p-1 text-slate-600 transition-all ease-in-out hover:bg-stone-100 group-hover:block"
      >
        <EditIcon />
      </button>
      <h4 className="text-xl lg:text-3xl">{formattedCity}</h4>
      <p className="text-lg italic">{label}</p>

      {clock && <TickingClock timezone={location} />}

      <p className="mt-1 text-center text-sm lg:text-base">
        <span className="hidden lg:inline">Timezone: {abbreviation} </span>
        &nbsp;
        <span>({timezoneUtcOffsetText})</span>
      </p>
      <p className="mt-2 text-center text-sm text-black/60 lg:mt-4 lg:text-base">
        {offsetText}
      </p>
    </div>
  );
}

// Inner component to render the ticking clock.
function TickingClock({ timezone }: { timezone: string }) {
  // Connect with GlobalClock to get the ticking effect.
  useGlobalClock((state) => state.count);

  const date = new Date();

  return (
    <p className="mt-2 text-center font-mono text-lg italic md:text-3xl lg:mt-4 lg:text-4xl">
      {date.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: true,
      })}
    </p>
  );
}
