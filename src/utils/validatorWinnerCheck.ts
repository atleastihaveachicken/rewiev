import type { BoardType, player } from "../types/game.types";
import type { winResult } from "../types/validator.types";

const validatorWinnerCheck = (
  board: BoardType,
  player: player,
): winResult | null => {
  const rows = board.length;
  const cols = board[0].length;

  const lineCheck = (
    newBoard: BoardType,
    startRow: number,
    startCol: number,
    deltaRow: number,
    deltaCol: number,
    player: player,
  ): [number, number][] | null => {
    const positions: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const r = startRow + i * deltaRow;
      const c = startCol + i * deltaCol;

      // проверка границ доски
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length)
        return null;
      if (newBoard[r][c] !== player) return null;

      positions.push([r, c]);
    }

    return positions;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const directions: [number, number][] = [
        [0, 1], // проверка по горизонтали
        [1, 0], // по вертикали
        [1, 1], // диагональ
        [-1, 1], // другая диагональ
      ];
      for (const [dr, dc] of directions) {
        const endRow = row + 3 * dr;
        const endCol = col + 3 * dc;

        if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
          continue;
        }

        const winningPositions = lineCheck(board, row, col, dr, dc, player);
        if (winningPositions) {
          return {
            who: player,
            positions: winningPositions,
          };
        }
      }
    }
  }
  return null;
};
export default validatorWinnerCheck;
