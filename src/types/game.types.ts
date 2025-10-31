export interface GameCellProps {
  value: player;
  onClick: () => void;
  isWinning: boolean;
}

export interface BoardProps {
  gameBoard: BoardType;
  handleClick: (column: colIndex) => void;
  disabled?: boolean;
  winningCells?: [number, number][];
}

export interface GameControlsProps {
  handleRetryButton: () => void;
  handleMenuButton: () => void;
  handleUndoButton: () => void;
  handleRedoButton: () => void;
  handleValidator: () => void;
}

export interface GameHeaderProps {
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
  onCvc: () => void;
}

export interface PvcBetsProps {
  onBet: (player: player, bet: number) => void; 
  balance: number;
  onChangeBet:(string:string) => void;
  handleMenuButton:() => void;
  bet: number;
}

export interface GameResultsProps {
  winner: player;
  isGameOver: boolean;
  balance: number;
  handleRetryButton: () => void;
  handleMenuButton: () => void;
  handleValidator: () => void;
  gameMode:string;
  currentBet: player;
}

export interface ValidatorScreenProps {
  handleMenuButton: () => void;
  turnHistory:number[];
}

export type rowIndex = number;
export type colIndex = number;
export type cellValue = player;
export type BoardType = cellValue[][];
export type player = "player_1" | "player_2" | null;
