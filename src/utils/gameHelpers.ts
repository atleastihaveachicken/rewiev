import type { BoardType, GameState } from "../types/game.types";
/**
 * Функция проверки на ничью - проходим по 7 колонкам и проверяем самую первую (верхнюю клетку)
 * @param board - текущее игровое поле 
 * @returns {boolean} - тру(ничья) или фолс (не ничья)
 */
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
/**
 * Начальное состояние
 * @satisfies {GameState}
 */
export const initialState: GameState = {
 
  bet: 200,
  balance: 1000,
  currentBet: null,
  gameHistory: [],
  currentMove: 0,
  turnHistory: [],
  winningCells: [],
  gameBoard: emptyBoard,
  isRedNext: true,
  isGameOver: false,
  gameMode: "pvp",
  currentScreen: "menu",
  winner: null,
};

export const RED_WINS_TEXT = "Red player wins!";
export const YELLOW_WINS_TEXT = "Yellow player wins!";
export const GAME_OVER_TEXT = "Game over";
export const DRAW_TEXT = "It's a draw";
