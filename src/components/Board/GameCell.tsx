import { useEffect, useState } from "react";
import type { GameCellProps } from "../../types/game.types.ts";
import "./Board.css";

/**
 * Компонент ячейки игрового поля
 * Отображает состояние ячейки (пустая, красная, желтая) с анимацией падения и подсветкой выигрышной комбинации
 * @param value - значение ячейки
 * @param onClick - функция обработки клика по ячейке
 * @param isWinning - проверяем, является ли ячейка выигрышной
 */
const GameCell = ({ value, onClick, isWinning }: GameCellProps) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!value) return;

    setIsNew(true);
    let timer = setTimeout(() => setIsNew(false), 500);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClass =
    value === "player_1" ? "red" : value === "player_2" ? "yellow" : "empty";
  const classes = `game__container-item ${colorClass} ${isNew ? "falling" : ""} ${isWinning ? "winning" : ""}`;

  return <button className={classes} onClick={onClick}></button>;
};
export default GameCell;
