import Button from "./Button";
import type { PvcBetsProps } from "../types/game.types";

const PvcBets = ({
  onBet,
  onChangeBet,
  handleMenuButton,
  balance,
  bet,
}: PvcBetsProps) => {
  return (
    <div className="menu__container">
      {balance >= 100 ? (
        <>
          <h1 className="game__title">Who is the next winner?</h1>
          <p className="game__title">You have {balance} points</p>
          <div className="bets__container">
            <Button onClick={() => onChangeBet("dec")} value="-" />
            <p className="game__title">Current bet is {bet}</p>
            <Button onClick={() => onChangeBet("inc")} value="+" />
          </div>
          <Button
            onClick={() => onBet("player_1", bet)}
            value={"I bet red win"}
          />
          <Button
            onClick={() => onBet("player_2", bet)}
            value={"i bet yellow win"}
          />
        </>
      ) : (
        <p className="game__title">
          {" "}
          You don't have enough points to make a bet! Better earn some at PvC
          mode
        </p>
      )}
      <Button onClick={handleMenuButton} value="Menu" />
    </div>
  );
};

export default PvcBets;
