import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ClockDisplay } from "../model/clockDisplay";
import { useQuery } from "@tanstack/react-query";
import { getTimezones } from "../services/timezoneApi";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function CityForm({
  onCancel,
  onSubmit,
  initialValue,
}: {
  onCancel: () => void;
  onSubmit: (v: ClockDisplay) => void;
  initialValue?: ClockDisplay;
}) {
  const timezonesQuery = useQuery({
    queryKey: ["time", "all"],
    queryFn: () => getTimezones(),
    select: (data) => data.data ?? [],
  });

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(
    initialValue?.location ?? "",
  );

  const filteredCheckboxOptions =
    query === ""
      ? (timezonesQuery.data ?? [])
      : (timezonesQuery.data?.filter((tz) => {
          return tz.toLowerCase().includes(query.toLowerCase());
        }) ?? []);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-solid bg-stone-200/80 py-4">
      <form
        className="w-5/6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!selected) {
            return;
          }

          const formData = new FormData(e.currentTarget);
          const label = formData.get("label") as string;

          let payload: ClockDisplay;
          if (initialValue) {
            payload = { id: initialValue.id, location: selected, label };
          } else {
            payload = { id: uuidv4(), location: selected, label };
          }
          onSubmit(payload);
        }}
      >
        <p className="block text-sm font-medium text-slate-700">
          {initialValue ? "Edit detail" : "Add city"}
        </p>
        <div className="mt-2">
          <Combobox
            value={selected}
            onChange={(value) => setSelected(value ?? "")}
            onClose={() => setQuery("")}
          >
            <div className="relative">
              <ComboboxInput<string>
                className={clsx(
                  "w-full rounded-lg border-none bg-black/5 py-1.5 pl-3 pr-8 text-sm/6 text-black",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
                  "placeholder:text-slate-500",
                )}
                displayValue={(tz) => tz}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search timezone"
                required
              />
              <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                <ChevronDownIcon className="size-4 fill-black/60 group-data-[hover]:fill-black" />
              </ComboboxButton>
            </div>

            <ComboboxOptions
              anchor="bottom"
              transition
              className={clsx(
                "w-[var(--input-width)] rounded-xl border border-black/5 bg-slate-800/95 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
              )}
            >
              {filteredCheckboxOptions.map((tz) => (
                <ComboboxOption
                  key={tz}
                  value={tz}
                  className="group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                >
                  <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                  <div className="text-sm/6 text-white">{tz}</div>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </div>
        <div>
          <input
            type="text"
            name="label"
            maxLength={20}
            placeholder="Add a label (optional)"
            defaultValue={initialValue?.label}
            className="mt-2 block w-full rounded-md bg-black/5 px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-black/25"
          />
        </div>

        <div className="mt-4 flex flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onCancel()}
            className="rounded-lg px-2 text-stone-500 hover:text-black focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-black/25"
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-black px-8 py-2 text-stone-100 ring-offset-2 transition-all focus:outline-none focus:ring focus:ring-slate-600 active:scale-95"
            type="submit"
          >
            {initialValue ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
