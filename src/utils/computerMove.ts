import type { BoardType, colIndex, player } from "../types/game.types";
import type { boardType } from "../types/validator.types";
import winnerCheck from "./winnerCheck";
/**
 * Функция, которая делает ход компьютера:
 * собирает доступные колонки для хода
 * проверяет, может ли победить текущий игрок (который ходит), может ли победить второй игрок,
 * занимает центр в 40% случаев, а в остальных делает случайный ход
 * @param board игровое поле
 * @param player текущий игрок
 * @returns {colIndex | -1} возвращает колонку для хода или -1 если доступных ходов нет
 */
const computerMove = (board: BoardType, player: player): number => {
  const avaliableColumns = [];
  const cloneBoard = (board: BoardType) => board.map((row) => [...row]);
  const newBoard = cloneBoard(board);
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === null) {
      avaliableColumns.push(col);
    }
  }

  if (avaliableColumns.length === 0) {
    return -1;
  }

  const opponent = player === "player_1" ? "player_2" : "player_1";

  // проверка на то, может ли компьютер победить -
  // для этого создаём копию доски и делаем там ход, если он выигрышный - возвращаем колонку
  const winMove = findWinMove(avaliableColumns, newBoard, player);
  if (winMove !== null) {
    return winMove;
  }

  //проверка на то, может ли победить второй игрок
  const blockMove = findWinMove(avaliableColumns, newBoard, opponent);
  if (blockMove !== null) {
    return blockMove;
  }
  //в первую очередь занимаем центр, но ставить просто в центр как-то топорно выглядит,
  // поэтому добавил к нему рандом
  const centralCol = 3;
  if (avaliableColumns.includes(centralCol) && Math.random() < 0.4) {
    return centralCol;
  }

  // если ниче не нашлось - делаем рандомный ход
  const randomIndex = Math.floor(Math.random() * avaliableColumns.length);
  return avaliableColumns[randomIndex];
};

// для симуляции кода дублирую кусок кода игрока - ищем самую нижнюю ячейку, возвращаем игровое поле со сделанным ходом
const simulateMove = (board: BoardType, colIndex: colIndex, player: player) => {
  const cloneBoard = (board: BoardType) => board.map((row) => [...row]);
  const newBoard = cloneBoard(board);
  for (let row = 5; row >= 0; row--) {
    if (newBoard[row][colIndex] === null) {
      newBoard[row][colIndex] = player;
      break;
    }
  }
  return newBoard;
};

const findWinMove = (
  avaliableColumns: number[],
  board: boardType,
  player: player,
) => {
  for (let i = 0; i < avaliableColumns.length; i++) {
    const col = avaliableColumns[i];
    const tempBoard = simulateMove(board, col, player);
    if (winnerCheck(tempBoard, player)) {
      return col;
    }
  }
  return null;
};

export default computerMove;
