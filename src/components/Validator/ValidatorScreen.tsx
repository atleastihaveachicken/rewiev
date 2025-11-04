import type { ValidatorScreenProps } from "../../types/game.types";
import validator from "../../utils/validator";
import Button from "../../ui/Button/Button";
import {
  RED_WINS_TEXT,
  YELLOW_WINS_TEXT,
  DRAW_TEXT,
} from "../../utils/gameHelpers";
import { useState } from "react";
import "./VlidatorScreen.css";
/**
 * Компонент с результатами функции валидатор: разбирает получившийся объект и показывает,
 * сколько всего было сделано ходов, кто победил и с какими ячейками
 * @param turnHistory - массив с историей ходов
 * @param handleMenuButton - выходим в меню
 */
const ValidatorScreen = ({
  handleMenuButton,
  turnHistory,
}: ValidatorScreenProps) => {
  const [showMoves, setShowMoves] = useState(false);

  const result = Object.entries(validator(turnHistory));
  console.log(result);

  /**
   * Получаем последний шаг игры (финальный результат)
   * Содержит информацию о победителе и выигрышных позициях
   */
  const lastStep = result.at(-1)?.[1];
  /**
   * Общее количество ходов. Вычитаю 1, потому что был степ_0
   */
  const totalMoves = result.length - 1;

  const player1Moves = turnHistory.filter((_, index) => index % 2 === 0);
  const player2Moves = turnHistory.filter((_, index) => index % 2 === 1);
  // Определяем статус игры
  const isWin = lastStep?.winner?.who;
  const isDraw = lastStep?.board_state === "draw";

  let statusText = "";

  if (isWin) {
    statusText =
      lastStep.winner.who === "player_1" ? RED_WINS_TEXT : YELLOW_WINS_TEXT;
  } else if (isDraw) {
    statusText = DRAW_TEXT;
  }

  return (
    <div className="game__container">
      <h1 className="game__title">Game results</h1>
      <div className="results__info">
        <p className="game__title"> Turns total: {totalMoves}</p>
        {isWin && (
          <>
            <p className="game__title">{statusText}</p>
            <div className="results__info-positions">
              <h2 className="game__title"> Winning moves: </h2>
              {lastStep.winner.positions.map(
                (pos: [number, number], i: number) => (
                  <div className="results__info-positions-item" key={i}>
                    Column: {pos[1] + 1}, Row: {pos[0] + 1}
                  </div>
                ),
              )}
            </div>
          </>
        )}

        {isDraw && <p className="game__title">{statusText}</p>}

        <Button
          onClick={() => setShowMoves(!showMoves)}
          value={showMoves ? "Hide moves" : "Show all moves"}
        />

        {showMoves && (
          <div className="moves__container">
            <div className="moves__container-player">
              <h3 className="game__title-red">Player 1 moves (Red):</h3>
              <div className="results">
                {player1Moves.map((col, index) => (
                  <div key={index}>
                    <b>Move {index + 1}:</b> Column {col + 1}
                  </div>
                ))}
              </div>
              <p>Total: {player1Moves.length} moves</p>
            </div>

            <div className="moves__container-player">
              <h3 className="game__title-yellow">Player 2 moves (Yellow):</h3>
              <div className="results">
                {player2Moves.map((col, index) => (
                  <div key={index}>
                    <b>Move {index + 1}:</b> Column {col + 1}
                  </div>
                ))}
              </div>
              <p>Total: {player2Moves.length} moves</p>
            </div>
          </div>
        )}
      </div>
      <Button onClick={handleMenuButton} value="Menu" />
    </div>
  );
};

export default ValidatorScreen;
