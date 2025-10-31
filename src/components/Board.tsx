import type { rowIndex, colIndex, BoardProps } from "../types/game.types";
import GameCell from "./GameCell";

const Board = ({
  gameBoard,
  handleClick,
  disabled,
  winningCells = [],
}: BoardProps) => {
  const isWinningCell = (row: rowIndex, col: colIndex) => {
    return winningCells?.some(
      ([winRow, winCol]) => winRow === row && winCol === col,
    );
  };

  return (
    <div className={`game__container${disabled ? " disabled" : ""}`}>
      {gameBoard.map((row, rowIndex: rowIndex) => (
        <div className="game__container-row" key={rowIndex}>
          {row.map((value, colIndex: colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}-${value}`}
              value={value}
              onClick={() => handleClick(colIndex)}
              isWinning={isWinningCell(rowIndex, colIndex)}
            ></GameCell>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
