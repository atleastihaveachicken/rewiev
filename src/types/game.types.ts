export interface SlotProps {
  value: player;
  onClick: () => void;
}

export interface BoardProps {
  gameBoard: BoardType;
  handleClick: (column: colIndex) => void;
  disabled?: boolean;
}

export interface GameControlsProps {
  handleRetryButton: () => void;
  handleMenuButton: () => void;
  handleUndoButton: () => void;
  handleRedoButton: () => void;
  handleValidator: () => void;
}

export interface HeaderProps {
  isGameOver: boolean;
  isRedNext: boolean;
  winner: player;
}

export interface ButtonProps {
  onClick: () => void;
  value: string;
}

export interface GameMenuProps {
  onPvp: () => void;
  onPvc: () => void;
}

export type rowIndex = number;
export type colIndex = number;
export type cellValue = player;
export type BoardType = cellValue[][];
export type player = "player_1" | "player_2" | null;
