export interface winResult {
  who: player;
  positions: [number, number][];
}

export interface Step {
  player_1: [number, number][];
  player_2: [number, number][];
  board_state: "waiting" | "pending" | "win" | "draw";
  winner?: winResult;
}

export interface StepResult {
  [key: `step_${number}`]: Step;
}

export type column = number;
export type boardType = ("player_1" | "player_2" | null)[][];
export type player = "player_1" | "player_2" | null;
