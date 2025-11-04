import type { GameMenuProps } from "../../types/game.types";
import Button from "../../ui/Button/Button";
/**
 * Компонент главного меню игры
 * Позволяет игроку выбрать тип игрового режима: ПвП, ПвС или СвС
 * @param onPvp запускает игру на двух игроков
 * @param onPvc запускает игру против компьютера
 * @param onCvc запускает игру двух компьютеров с возможностью сделать ставку на то кто победит
 */
const GameMenu = ({ onPvp, onPvc, onCvc }: GameMenuProps) => {
  return (
    <div className="menu__container">
      <h1 className="game__title">Connect Four Game</h1>
      <Button onClick={onPvp} value="New game PvP" />
      <Button onClick={onPvc} value="New game PvC" />
      <Button onClick={onCvc} value="New game CvC" />
    </div>
  );
};

export default GameMenu;
