import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ClockDisplay } from "../model/clockDisplay";
import { useQuery } from "@tanstack/react-query";
import { getTimezones } from "../api";
import { getFormattedTzName } from "../helper";

export default function AddCityCard({
  onSubmit,
}: {
  onSubmit: (v: ClockDisplay) => void;
}) {
  const [isFormMode, setFormMode] = useState(false);
  if (isFormMode) {
    return (
      <AddCityForm
        onSubmit={(v) => {
          setFormMode(false);
          onSubmit(v);
        }}
        onCancel={() => setFormMode(false)}
      />
    );
  }
  return (
    <div
      onClick={() => setFormMode(true)}
      className="bg-stone-200/40 hover:bg-stone-200/80 py-10 transition-all ease-in-out backdrop-blur rounded-xl flex flex-col justify-center items-center border-stone-100 border-2 border-solid cursor-pointer"
    >
      <p className="text-3xl leading-3 ">+</p>
      <div className="h-2" />
      <p className="text-sm italic">Add City</p>
    </div>
  );
}

export function AddCityForm({
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
  });

  return (
    <div className="bg-stone-200/80 py-4 rounded-xl flex flex-col justify-center items-center border-2 border-solid">
      <form
        className="w-5/6"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const formObj = Object.fromEntries(data) as {
            label: string;
            location: string;
          };

          let payload: ClockDisplay;
          if (initialValue) {
            payload = { id: initialValue.id, ...formObj };
          } else {
            payload = { id: uuidv4(), ...formObj };
          }
          onSubmit(payload);
        }}
      >
        <p className="block text-sm font-medium text-slate-700">
          {initialValue ? "Edit detail" : "Add city"}
        </p>
        <div className="mt-2">
          <select
            name="location"
            required
            defaultValue={initialValue?.location}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-600
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
          >
            <option value={""}>Choose a city</option>
            {timezonesQuery.data?.data?.map((key) => {
              return (
                <option key={key} value={key}>
                  {getFormattedTzName(key)}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <input
            type="text"
            name="label"
            maxLength={20}
            placeholder="Add a label (optional)"
            defaultValue={initialValue?.label}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-600
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
    "
          />
        </div>

        <div className="flex flex-row justify-between items-center gap-2  mt-4 ">
          <button
            type="button"
            onClick={() => onCancel()}
            className="hover:text-black text-stone-500"
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 rounded-xl bg-black active:scale-95 transition-all focus:outline-none focus:ring focus:ring-stone-300 text-stone-100"
            type="submit"
          >
            {initialValue ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
