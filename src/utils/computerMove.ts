import type { BoardType, colIndex, player } from "../types/game.types";
import winnerCheck from "./winnerCheck";

export default function computerMove(board: BoardType, player: player): number {
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
  for (let i = 0; i < avaliableColumns.length; i++) {
    const col = avaliableColumns[i];
    const tempBoard = simulateMove(newBoard, col, player);
    if (winnerCheck(tempBoard, player)) {
      return col;
    }
  }
  //проверка на то, может ли победить второй игрок
  for (let i = 0; i < avaliableColumns.length; i++) {
    const col = avaliableColumns[i];
    const tempBoard = simulateMove(newBoard, col, opponent);
    if (winnerCheck(tempBoard, opponent)) {
      return col;
    }
  }
  //в первую очередь занимаем центр
  const centralCol = 3;
  if (avaliableColumns.includes(centralCol)) {
    return centralCol;
  }

  // если ниче не нашлось - делаем рандомный ход
  const randomIndex = Math.floor(Math.random() * avaliableColumns.length);
  return avaliableColumns[randomIndex];
}

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
