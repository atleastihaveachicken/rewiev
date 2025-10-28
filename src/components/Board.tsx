import Slot from "./Slot";
import type { rowIndex, colIndex, BoardProps } from "../types/game.types";

const Board = ({ gameBoard, handleClick, disabled }: BoardProps) => {
  return (
    <div className={`game__container${disabled ? " disabled" : ""}`}>
      {gameBoard.map((row, rowIndex: rowIndex) => (
        <div className="game__container-row" key={rowIndex}>
          {row.map((value, colIndex: colIndex) => (
            <Slot
              key={`${rowIndex}-${colIndex}-${value}`}
              value={value}
              onClick={() => handleClick(colIndex)}
            ></Slot>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
