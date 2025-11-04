import type { GameControlsProps } from "../../types/game.types";
import Button from "../../ui/Button/Button";
/**
 * Компонент для управления процессом игры: кнопки повтора, выхода в меню, отмены/повторения хода
 * @param handleRetryButton функция перезапуска игры
 * @param handleMenuButton функция выхода в меню
 * @param handleUndoButton отмена хода
 * @param handleRedoButton повторение отмененненого хода
 */
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
