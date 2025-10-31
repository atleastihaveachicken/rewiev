import type { GameControlsProps } from "../types/game.types";
import Button from "./Button";

const GameControls = ({
  handleRetryButton,
  handleMenuButton,
  handleUndoButton,
  handleRedoButton,
}: GameControlsProps) => {
  return (
    <div className="gameControls__container">
      <Button onClick={handleRetryButton} value="Retry" />
      <Button onClick={handleMenuButton} value="Menu" />
      <Button onClick={handleUndoButton} value="Undo" />
      <Button onClick={handleRedoButton} value="Redo" />
      
    </div>
  );
};
export default GameControls;
