import type { GameResultsProps } from "../types/game.types";
import Button from "./Button";

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
  const RED_WINS_TEXT = "Red player wins!";
  const YELLOW_WINS_TEXT = "Yellow player wins!";
  const GAME_OVER_TEXT = "Game over";
  const BET_WON_TEXT = "Your bet won! Your bet doubled ";
  const BET_LOOSE_TEXT = "Your bet lost! ";
  const BET_DRAW_TEXT = "Draw! Your bet returned ";

  let statusText: string = "";
  let betResultText: string = "";

  if (winner) {
    statusText = winner === "player_1" ? RED_WINS_TEXT : YELLOW_WINS_TEXT;

    if (currentBet && gameMode === "cvc") {
      if (currentBet === winner) {
        betResultText = BET_WON_TEXT;
      } else {
        betResultText = BET_LOOSE_TEXT;
      }
    }
  } else if (isGameOver) {
    statusText = GAME_OVER_TEXT;
    betResultText = BET_DRAW_TEXT;
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
