import type { GameResultsProps } from "../../types/game.types";
import Button from "../../ui/Button/Button";
import {
  RED_WINS_TEXT,
  YELLOW_WINS_TEXT,
  GAME_OVER_TEXT,
} from "../../utils/gameHelpers";
/**
 * Компонент с результатами игры и итогами ставок
 * Показывает победителя, результаты ставок, обновленный баланс и две кнопки: снова и в меню.
 * Также можно отвалидировать итоги матча с помощью функции из второго задания
 *
 * @param winner - победитель игры
 * @param isGameOver - флаг завершения игры (ничья)
 * @param balance - текущий баланс игрока после игры
 * @param handleMenuButton - возврат в главное меню
 * @param handleRetryButton - перезапуск игры
 * @param gameMode - режим игры
 * @param currentBet - текущая ставка игрока ('player_1', 'player_2' или null)
 * @param handleValidator - валидатор
 */
const GameResults = ({
  winner,
  isGameOver,
  balance,
  handleMenuButton,
  handleRetryButton,
  gameMode,
  currentBet,
  handleValidator,
}: GameResultsProps) => {
  const BET_WON_TEXT = "Your bet won! Your bet doubled ";
  const BET_LOSE_TEXT = "Your bet lost! ";
  const BET_DRAW_TEXT = "Draw! Your bet returned ";

  let statusText: string = "";
  let betResultText: string = "";

  if (winner) {
    statusText = winner === "player_1" ? RED_WINS_TEXT : YELLOW_WINS_TEXT;

    if (currentBet && gameMode === "cvc") {
      if (currentBet === winner) {
        betResultText = BET_WON_TEXT;
      } else {
        betResultText = BET_LOSE_TEXT;
      }
    }
  } else if (isGameOver) {
    statusText = GAME_OVER_TEXT;
    if (gameMode === "cvc") {
      betResultText = BET_DRAW_TEXT;
    }
  }

  return (
    <div className="game__container">
      <p className="game__title"> {statusText}</p>
      {betResultText && (
        <>
          <p className="game__title"> {betResultText}</p>
          <p className="game__title">You now have {balance} points</p>
        </>
      )}
      {gameMode === "pvc" && winner && (
        <p className="game__title">You earn 200 points</p>
      )}

      <Button onClick={handleRetryButton} value="Retry" />
      <Button onClick={handleMenuButton} value="Menu" />
      <Button onClick={handleValidator} value="Validate this match" />
    </div>
  );
};

export default GameResults;
