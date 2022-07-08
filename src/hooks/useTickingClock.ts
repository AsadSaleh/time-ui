import { useEffect, useState } from "react";

export default function useTickingClock(initialDate: Date) {
  const [clock, setClock] = useState<Date>(initialDate);

  // console.log(clock);

  function createPlusOneSecondDate(currDate: Date) {
    console.log("createplusone");
    return new Date(currDate.setTime(currDate.getTime() + 1000));
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setClock(createPlusOneSecondDate);
    }, 1000);
    console.log("i fire once with id: ", intervalId);

    return () => {
      console.log("clearing: ", intervalId);
      clearInterval(intervalId);
    };
  }, []);

  return clock;
}
