import { useState, useEffect, useRef } from "react";

// Each how many milliseconds it will calculate and display the speed
const FREQUENCY = 10000;

export function useUpdatesPerMinute() {
  const [updatesPerMinute, setUpdatesPerMinute] = useState(0);
  const updates = useRef<number[]>([]);
  const recordNewUpdate = () => {
    updates.current = updates.current.concat(Date.now());
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newUpdatesPerMinute =
        (updates.current.filter((u) => u > Date.now() - FREQUENCY).length *
          60000) /
        FREQUENCY;
      setUpdatesPerMinute(newUpdatesPerMinute);
    }, FREQUENCY);
    return () => clearInterval(intervalId);
  }, []);

  return {
    updatesPerMinute,
    recordNewUpdate,
  };
}
