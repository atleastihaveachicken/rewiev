import type { GameMenuProps } from "../types/game.types";
import Button from "./Button";

const GameMenu = ({ onPvp, onPvc }: GameMenuProps) => {
  return (
    <div className="menu__container">
      <h1 className="game__title">Connect Four Game</h1>
      <Button onClick={() => onPvp()} value="New game PvP" />
      <Button onClick={() => onPvc()} value="New game PvC" />
    </div>
  );
};

export default GameMenu;
