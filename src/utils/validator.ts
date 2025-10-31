import winnerCheck from "./winnerCheck.ts";

import type {
  StepResult,
  player,
  Step,
  column,
  boardType,
} from "../types/validator.types.ts";

const validator = (moves: number[]) => {
  const result: StepResult = {};
  const board = createNewBoard();

  result["step_0"] = { player_1: [], player_2: [], board_state: "waiting" };

  let stepNumber = 0;

  moves.forEach((column, i) => {
    const row = findRow(board, column);
    if (row === -1) return;

    const currentPlayer: player = i % 2 === 0 ? "player_1" : "player_2";
    board[row][column] = currentPlayer;
    stepNumber++;

    const winnerStep = winnerCheck(board, currentPlayer);
    const isDraw =
      !winnerStep && board.every((row) => row.every((cell) => cell !== null));
    const boardState: Step["board_state"] = winnerStep
      ? "win"
      : isDraw
        ? "draw"
        : "pending";

    result[`step_${stepNumber}`] = {
      player_1: countChips(board, "player_1"),
      player_2: countChips(board, "player_2"),
      board_state: boardState,
      ...(winnerStep ? { winner: winnerStep } : {}),
    };
  });

  return result;
};

const createNewBoard = () =>
  Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));

function findRow(board: boardType, column: column) {
  for (let row = 5; row >= 0; row--) {
    if (board[row][column] === null) {
      return row;
    }
  }
  return -1;
}

function countChips(board: boardType, player: player) {
  const chips: [number, number][] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      if (board[row][col] === player) {
        chips.push([row, col]);
      }
    }
  }
  return chips;
}

export default validator;
