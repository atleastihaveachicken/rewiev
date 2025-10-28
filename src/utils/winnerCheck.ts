import type { BoardType, player } from "../types/game.types";

const winnerCheck = (board: BoardType, player: player) => {
  const rows = board.length;
  const cols = board[0].length;

  const lineCheck = (r: number, c: number, dr: number, dc: number): boolean => {
    for (let i = 0; i < 4; i++) {
      const nr = r + i * dr;
      const nc = c + i * dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
      if (board[nr][nc] !== player) return false;
    }
    return true;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const directions: [number, number][] = [
        [0, 1], // проверка по горизонтали
        [1, 0], // по вертикали
        [1, 1], // диагональ
        [-1, 1], // другая диагональ
      ];
      if (directions.some(([dr, dc]) => lineCheck(row, col, dr, dc))) {
        return player;
      }
    }
  }
};
export default winnerCheck;
