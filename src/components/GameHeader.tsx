import type { GameHeaderProps } from "../types/game.types";

const GameHeader = ({ isRedNext, winner }: GameHeaderProps) => {
  const NEXT_TURN_TEXT = `Next is ${isRedNext ? "red" : "yellow"}`;
  const RED_WINS_TEXT = "Red player wins!";
  const YELLOW_WINS_TEXT = "Yellow player wins!";
  let statusText: string = NEXT_TURN_TEXT;
  if (winner) {
    statusText = winner === "player_1" ? RED_WINS_TEXT : YELLOW_WINS_TEXT;
  }
  return (
    <header className="main__header">
      <h1 className="game__title">Connect Four Game</h1>
      <p className="game__title">{statusText}</p>
    </header>
  );
};

export default GameHeader;
