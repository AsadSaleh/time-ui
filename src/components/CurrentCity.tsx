import useGlobalClock from "../hooks/useGlobalClock";

export default function CurrentCityCard() {
  useGlobalClock((state) => state.count);

  const clock = new Date();

  return (
    <div className="flex flex-col items-center bg-white/40 rounded-xl py-10 backdrop-blur">
      <div className="text-2xl md:text-7xl">Jakarta</div>
      <p className="text-3xl md:text-8xl font-mono italic">
        {clock.toLocaleTimeString("en-US", {
          timeZone: "Asia/Jakarta",
          hour12: false,
        })}
      </p>
      <p className="font-thin text-lg">Timezone: GMT+7</p>
    </div>
  );
}
