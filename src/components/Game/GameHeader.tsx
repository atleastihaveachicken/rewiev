import type { GameHeaderProps } from "../../types/game.types";
import {
  RED_WINS_TEXT,
  YELLOW_WINS_TEXT,
  GAME_OVER_TEXT,
} from "../../utils/gameHelpers";

/**
 * Компонент заголовка игры, отображает текущее состояние:
 * показывает чей ход следующий или объявляет победителя/ничью
 * @param isRedNext флаг который показывает, ходит ли следующим красный игрок
 * @param winner победитель игры ('player_1', 'player_2' или null)
 */
const GameHeader = ({ isRedNext, winner, isGameOver }: GameHeaderProps) => {
  const NEXT_TURN_TEXT = `Next is ${isRedNext ? "red" : "yellow"}`;
  let statusText: string = NEXT_TURN_TEXT;

  if (winner) {
    statusText = winner === "player_1" ? RED_WINS_TEXT : YELLOW_WINS_TEXT;
  } else if (isGameOver) {
    statusText = GAME_OVER_TEXT;
  }
  return (
    <header className="main__header">
      <h1 className="game__title">Connect Four Game</h1>
      <p className="game__title">{statusText}</p>
    </header>
  );
};

export default GameHeader;
