import type { rowIndex, colIndex, BoardProps } from "../../types/game.types";
import GameCell from "./GameCell";
import "./Board.css";
/**
 * Компонент игрового поля
 * Отображает сетку ячеек, обрабатывает клики и подсвечивает выигрышные комбинации
 * @param gameBoard - двумерный массив, игровое поле
 * @param handleClick - обрабатываем клик по колонке
 * @param disabled - флаг, блокирующий взаимодействие с полем во время хода компьютера
 * @param winningCells - массив выигрышных ячеек для подсветки
 */
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
