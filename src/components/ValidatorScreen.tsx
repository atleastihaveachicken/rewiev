import type { ValidatorScreenProps } from "../types/game.types";
import validator from "../utils/validator";
import Button from "./Button";

const ValidatorScreen = ({
  handleMenuButton,
  turnHistory,
}: ValidatorScreenProps) => {
  const result = Object.entries(validator(turnHistory));
  const lastStep = result.at(-1)?.[1];
  const totalMoves = result.length - 1;
  return (
    <div className="game__container">
      <h1 className="game__title">Game results</h1>
      <div className="results__info">
        <p className="game__title"> Turns total: {totalMoves}</p>
        <p className="game__title">
          {" "}
          The winner is:{" "}
          {lastStep.winner.who === "player_1" ? "Игрок 1" : "Игрок 2"}
        </p>
        <div className="results__info-positions">
          <h2 className="game__title"> Winning moves: </h2>
          {lastStep.winner.positions.map((pos: [number, number], i: number) => (
            <div className="results__info-positions-item" key={i}>
              Column: {pos[1] + 1}, Row: {pos[0] + 1}
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleMenuButton} value="Menu" />
    </div>
  );
};

export default ValidatorScreen;
