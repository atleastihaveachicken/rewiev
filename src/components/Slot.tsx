import { useEffect, useState } from "react";
import type { SlotProps } from "../types/game.types.ts";

const Slot = ({ value, onClick }: SlotProps) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!value) return;

    setIsNew(true);
    let timer = setTimeout(() => setIsNew(false), 500);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClass =
    value === "player_1" ? "red" : value === "player_2" ? "yellow" : "empty";
  const classes = `game__container-item ${colorClass} ${isNew ? "falling" : ""}`;

  return <div className={classes} onClick={onClick}></div>;
};
export default Slot;
