import type { BoardType, player } from "../types/game.types";
import type { winResult } from "../types/validator.types";

/**
 * Проверяет наличие выигрышной комбинации для указанного игрока на игровом поле
 * Ищет последовательность из 4 одинаковых символов по горизонтали, вертикали или диагоналям
 *
 * @param {BoardType} board - игровое поле в виде двумерного массива
 * @param {player} player - игрок
 * @returns {winResult | null} объект с информацией о выигрыше или null, если выигрыша нет
 */
const WinnerCheck = (board: BoardType, player: player): winResult | null => {
  const rows = board.length;
  const cols = board[0].length;

  /**
   * Проверяет линию из 4 клеток в заданном направлении
   *
   * @param {BoardType} board - игровое поле для проверки
   * @param {number} startRow - начальная строка для проверки
   * @param {number} startCol - начальный столбец для проверки
   * @param {number} deltaRow - шаг по строкам (0 - горизонталь, 1 - вниз, -1 - вверх)
   * @param {number} deltaCol - шаг по столбцам (0 - вертикаль, 1 - вправо)
   * @param {player} player - игрок, для которого проверяется комбинация
   * @returns {[number, number][] | null} массив позиций выигрышной комбинации или null
   */
  const lineCheck = (
    board: BoardType,
    startRow: number,
    startCol: number,
    deltaRow: number,
    deltaCol: number,
    player: player,
  ): [number, number][] | null => {
    const positions: [number, number][] = [];
    // проверяем 4 последовательные клетки в заданном направлении
    for (let i = 0; i < 4; i++) {
      const r = startRow + i * deltaRow;
      const c = startCol + i * deltaCol;

      // проверка границ доски - если выходим за её пределы, то выигрышной комбинации не будет
      if (r < 0 || r >= board.length || c < 0 || c >= board[0].length)
        return null;
      if (board[r][c] !== player) return null;

      positions.push([r, c]);
    }
    return positions;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      /**
       * Направления для проверки выигрышных комбинаций:
       * [0, 1]  - горизонталь вправо
       * [1, 0]  - вертикаль вниз
       * [1, 1]  - диагональ вправо-вниз
       * [-1, 1] - диагональ вправо-вверх
       */
      const directions: [number, number][] = [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 1],
      ];
      //проверяем все направления из текущей клетки
      for (const [dr, dc] of directions) {
        // вычисляем конечную позицию для комбинации из 4 клеток
        const endRow = row + 3 * dr;
        const endCol = col + 3 * dc;
        //если комбинация выходит за пределы поля - такое направление пропускаем
        if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
          continue;
        }

        const winningPositions = lineCheck(board, row, col, dr, dc, player);
        if (winningPositions) {
          return {
            who: player,
            positions: winningPositions,
          };
        }
      }
    }
  }
  return null;
};
export default WinnerCheck;
