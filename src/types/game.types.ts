export interface GameCellProps {
  value: player;
  onClick: () => void;
  isWinning: boolean;
}

export interface BoardProps {
  gameBoard: BoardType;
  handleClick: (column: colIndex) => void;
  /** Отключаем клетки во время хода компьютеров в режимах PvC и CvC*/
  disabled?: boolean;
  /** Выигрышные клетки - нужны для увеличения с помощью стилей */
  winningCells?: [number, number][];
}

export interface GameControlsProps {
  handleRetryButton: () => void;
  handleMenuButton: () => void;
  handleUndoButton: () => void;
  handleRedoButton: () => void;
}

export interface GameHeaderProps {
  isRedNext: boolean;
  winner: player;
  isGameOver: boolean;
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

export interface GameBetsProps {
  onBet: (player: player, bet: number) => void;
  /** Сколько денег у игрока */
  balance: number;
  onChangeBet: (string: string) => void;
  handleMenuButton: () => void;
  bet: number;
}

export interface GameResultsProps {
  winner: player;
  isGameOver: boolean;
  balance: number;
  handleRetryButton: () => void;
  handleMenuButton: () => void;
  handleValidator: () => void;
  gameMode: string;
  currentBet: player;
}

export interface ValidatorScreenProps {
  handleMenuButton: () => void;
  turnHistory: number[];
}

export interface GameState {
  /**
   * Размер ставки
   */
  bet: number;
  /**
   * Баланс игрока
   */
  balance: number;
  /**
   * На кого (игрок 1 или игрок 2) ставим
   */
  currentBet: player | null;
  /**
   * История ходов - нужна для работы кнопок анду/реду
   */
  gameHistory: BoardType[];
  /**
   * Текущий номер хода
   */
  currentMove: number;
  /**
   * Массив с ходами обоих игроков - нужен для вызова валидатора после матча
   */
  turnHistory: number[];
  /**
   * Выигрышные ячейки - нужны для подсветки в случае победы
   */
  winningCells: [number, number][];
  /**
   * Игровое поле
   */
  gameBoard: BoardType;
  /**
   * Флаг для смены очередности игроков
   */
  isRedNext: boolean;
  /**
   * Флаг для завершения игры
   */
  isGameOver: boolean;
  /**
   * Игровой режим
   */
  gameMode: "pvp" | "pvc" | "cvc";
  /**
   * Текущий экран игры 
   */
  currentScreen: string;
  /**
   * Победитель
   */
  winner: player | null;
}

export type Action =
  | { type: "START_GAME"; mode: GameState["gameMode"] }
  | { type: "MAKE_MOVE"; colIndex: colIndex; player: player }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RETRY" }
  | { type: "SET_SCREEN"; screen: GameState["currentScreen"] }
  | { type: "SET_BET"; bet: number; currentBet: player }
  | { type: "CHANGE_BET"; bet: number }
  | { type: "LOAD_STATE"; data: Partial<GameState> };

export type rowIndex = number;
export type colIndex = number;
export type cellValue = player;
export type BoardType = cellValue[][];
export type player = "player_1" | "player_2" | null;
