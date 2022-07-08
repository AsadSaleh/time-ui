import useFetchTimezone from "../hooks/useFetchTimezone";
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
  return (
    <div className="group bg-stone-300 rounded-xl flex flex-col justify-center items-center py-6 relative">
      <div
        onClick={() => props.onDelete?.()}
        className="bg-stone-700 group-hover:block absolute hidden right-2 top-2 cursor-pointer p-1 rounded-xl"
      >
        <TrashIcon className="text-red-200" />
      </div>
      <h4 className="text-3xl">{city}</h4>
      <p className="text-lg italic">{props.label ?? "-"}</p>

      <p className="text-4xl mt-4">
        {clock.toLocaleTimeString("en-US", {
          timeZone: props.location,
          hour12: false,
        })}
      </p>

      <p className="font-thin">Timezone: {abbreviation}</p>
      <p className="text-center mt-4">{text}</p>
    </div>
  );
}
