import type { HeaderProps } from "../types/game.types";

const Header = ({ isGameOver, isRedNext, winner }: HeaderProps) => {
  const RED_WINS_TEXT = "Red player wins!";
  const YELLOW_WINS_TEXT = "Yellow player wins!";
  const GAME_OVER_TEXT = "Game over";
  const NEXT_TURN_TEXT = `Next is ${isRedNext ? "red" : "yellow"}`;

  let statusText: string;

  if (winner) {
    statusText = winner === "player_1" ? RED_WINS_TEXT : YELLOW_WINS_TEXT;
  } else if (isGameOver) {
    statusText = GAME_OVER_TEXT;
  } else {
    statusText = NEXT_TURN_TEXT;
  }

  return (
    <header className="main__header">
      <h1 className="game__title">Connect Four Game</h1>
      <p className="game__title">{statusText}</p>
    </header>
  );
};

export default Header;
