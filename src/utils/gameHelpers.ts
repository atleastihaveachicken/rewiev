import type { BoardType } from "../types/game.types";

export const drawCheck = (board: BoardType) => {
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === null) {
      return false;
    }
  }
  return true;
};

export const cloneBoard = (board: BoardType) => board.map((row) => [...row]);

export const emptyBoard = Array(6)
  .fill(null)
  .map(() => Array(7).fill(null));
