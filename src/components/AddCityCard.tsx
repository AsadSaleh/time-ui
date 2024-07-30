import { useState } from "react";
import { ClockDisplay } from "../model/clockDisplay";
import CityForm from "./CityForm";

export default function AddCityCard({
  onSubmit,
}: {
  onSubmit: (v: ClockDisplay) => void;
}) {
  const [isFormMode, setFormMode] = useState(false);
  if (isFormMode) {
    return (
      <CityForm
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
      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-solid border-stone-100 bg-stone-200/40 py-10 backdrop-blur transition-all ease-in-out hover:bg-stone-200/50"
    >
      <p className="text-3xl leading-3">+</p>
      <div className="h-2" />
      <p className="text-sm italic">Add City</p>
    </div>
  );
}
