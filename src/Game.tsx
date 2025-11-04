import { useEffect, useReducer } from "react";
import "../src/components/Game/Game.css";
import Board from "./components/Board/Board";
import GameControls from "./components/Game/GameControls";
import GameHeader from "./components/Game/GameHeader";
import type { colIndex, GameState, Action } from "./types/game.types";
import winnerCheck from "./utils/winnerCheck";
import GameMenu from "./components/Game/GameMenu";
import computerMove from "./utils/computerMove";
import {drawCheck, cloneBoard, emptyBoard, initialState} from "./utils/gameHelpers";
import GameBets from "./components/Game/GameBets";
import GameResults from "./components/Game/GameResult";
import ValidatorScreen from "./components/Validator/ValidatorScreen";

/**
 * Редьюсер для управления состояния игры 
 * @param state - текущее состояние игры 
 * @param action - действие для изменения состояния
 * @returns 
 */
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "LOAD_STATE":
      return {
        ...state,
        ...action.data,
      };

    case "START_GAME":
      return {
        ...state,
        gameMode: action.mode,
        currentScreen: action.mode === "cvc" ? "bets" : "game",
        gameBoard: emptyBoard,
        gameHistory: [emptyBoard],
        turnHistory: [],
        winner: null,
        isGameOver: false,
        isRedNext: true,
        winningCells: [],
        currentMove: 0,
      };
    case "MAKE_MOVE": {
      if (state.isGameOver) return state;

      const newBoard = cloneBoard(state.gameBoard);
      let moveMade = false;
      //ищем первую свободную ячейку в колонке 
      for (let row = 5; row >= 0; row--) {
        if (newBoard[row][action.colIndex] === null) {
          newBoard[row][action.colIndex] = action.player;
          moveMade = true;
          break;
        }
      }
      if (!moveMade) return state;
      const winResult = winnerCheck(newBoard, action.player);
      // если нашли победителя
      if (winResult?.who) {
        return {
          ...state,
          gameBoard: newBoard,
          winner: winResult.who,
          isGameOver: true,
          winningCells: winResult.positions,
          balance:
            state.gameMode === "cvc" && state.currentBet === winResult.who
              ? state.balance + state.bet * 2
              : state.balance + (state.gameMode === "pvc" ? 200 : 0),
          turnHistory: [...state.turnHistory, action.colIndex],
          gameHistory: [
            ...state.gameHistory.slice(0, state.currentMove + 1),
            newBoard,
          ],
          currentMove: state.currentMove + 1,
        };
      }
      //если нашли ничью 
      if (drawCheck(newBoard)) {
        return {
          ...state,
          gameBoard: newBoard,
          isGameOver: true,
          balance: state.balance + state.bet,
          gameHistory: [
            ...state.gameHistory.slice(0, state.currentMove + 1),
            newBoard,
          ],
          currentMove: state.currentMove + 1,
          turnHistory: [...state.turnHistory, action.colIndex],
        };
      }
      //обычный ход без выигрыша 
      return {
        ...state,
        gameBoard: newBoard,
        gameHistory: [
          ...state.gameHistory.slice(0, state.currentMove + 1),
          newBoard,
        ],
        turnHistory: [...state.turnHistory, action.colIndex],
        currentMove: state.currentMove + 1,
        isRedNext: !state.isRedNext,
      };
    }
    case "UNDO": {
      if (state.currentMove === 0) {
        return {
          ...initialState,
          currentScreen: state.currentScreen,
        };
      }
      const prevMove = state.currentMove - 1;
      const prevBoard = state.gameHistory[prevMove];
      if (!prevBoard) {
        return {
          ...initialState,
          currentScreen: state.currentScreen,
        };
      }
      return {
        ...state,
        currentMove: prevMove,
        gameBoard: prevBoard,
        isRedNext: prevMove % 2 === 0,
        isGameOver: false,
        winner: null,
        winningCells: [],
        turnHistory: state.turnHistory.slice(0, -1),
      };
    }
    case "REDO": {
      if (state.currentMove >= state.gameHistory.length - 1) return state;
      const nextMove = state.currentMove + 1;

      const nextBoard = state.gameHistory[nextMove];
      if (!nextBoard) return state;
      // если после выигрыша нажать на анду а потом снова на реду - то выигрышные квадратики не будут подсвечиваться,
      // поэтому добавил вот эту дополнительную проверку на виннер, геймовер и выигрышные клетки - и передаю их
      const redPlayerWin = winnerCheck(nextBoard, "player_1");
      const yelPlayerWin = winnerCheck(nextBoard, "player_2");
      const winner = redPlayerWin?.who || yelPlayerWin?.who || null;
      const isGameOver = winner !== null || drawCheck(nextBoard);
      const winningCells =
        redPlayerWin?.positions || yelPlayerWin?.positions || [];

      return {
        ...state,
        currentMove: nextMove,
        gameBoard: nextBoard,
        isRedNext: nextMove % 2 === 0,
        winner,
        isGameOver,
        winningCells,
      };
    }
    case "RETRY":
      return {
        ...initialState,
        gameMode: state.gameMode,
        balance: state.balance,
        currentScreen: state.gameMode === "cvc" ? "bets" : "game",
        //для cvc сбрасываю ставку и проверяю чтобы ставка не была больше тем текущий баланс
        ...(state.gameMode === "cvc" && {
          bet:
            state.balance < initialState.bet ? state.balance : initialState.bet,
          currentBet: null,
        }),
      };

    case "SET_SCREEN":
      return { ...state, currentScreen: action.screen };

    case "CHANGE_BET":
      return {
        ...state,
        bet: action.bet,
      };

    case "SET_BET": {
      return {
        ...state,
        bet: action.bet,
        currentBet: action.currentBet,
        balance: state.balance - action.bet,
        currentScreen: "game",
      };
    }
    default:
      return state;
  }
};

const Game = () => {
  /**
   * Инициализация состояния игры с загрузкой из localStorage
   */
  const [state, dispatch] = useReducer(gameReducer, initialState, (): GameState => {
      const savedData = localStorage.getItem("gameData");
      return savedData
        ? { ...initialState, ...JSON.parse(savedData) }
        : initialState;
    },
  );
  /**
   * Эффект для автоматического перехода на экран результатов после завершения игры
   */
  useEffect(() => {
    if (state.isGameOver && state.currentScreen === "game") {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_SCREEN", screen: "results" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.isGameOver, state.currentScreen]);
/**
   * Функция для выполнения хода игрока
   * @param {colIndex} colIndex - Индекс колонки для хода
   */
  const makeMove = (colIndex: colIndex) => {
    const currentPlayer = state.isRedNext ? "player_1" : "player_2";
    dispatch({ type: "MAKE_MOVE", colIndex, player: currentPlayer });
  };

  // обработка хода компьютера
  useEffect(() => {
    if (state.isGameOver || state.currentScreen !== "game") return;
    const timer = setTimeout(() => {
      if (state.gameMode === "pvc" && !state.isRedNext) {
        const currentPlayer = "player_2";
        const computerCol = computerMove(state.gameBoard, currentPlayer);

        if (computerCol !== -1) {
          dispatch({type: "MAKE_MOVE", colIndex: computerCol, player: currentPlayer,
          });
        }
      } else if (state.gameMode === "cvc") {
        const currentPlayer = state.isRedNext ? "player_1" : "player_2";
        const computerCol = computerMove(state.gameBoard, currentPlayer);

        if (computerCol !== -1) {
          dispatch({type: "MAKE_MOVE", colIndex: computerCol, player: currentPlayer,
          });
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    state.gameMode,
    state.isRedNext,
    state.isGameOver,
    state.currentScreen,
    state.gameBoard,
  ]);
/**
   * Функция для изменения размера ставки
   * @param {string} action - Действие: "inc" для увеличения, "dec" для уменьшения
   */
  const handleChangeBet = (action: string) => {
    if (action === "dec") {
      const newBet = Math.max(100, state.bet - 100);
      dispatch({ type: "CHANGE_BET", bet: newBet });
    } else if (action === "inc") {
      const newBet = Math.min(state.balance, state.bet + 100);
      dispatch({ type: "CHANGE_BET", bet: newBet });
    }
  };
/**
 * Флаг для хода компьютера 
 */
  const isComputerMove =
    (state.gameMode === "pvc" && !state.isRedNext) || state.gameMode === "cvc";

  // сохранение в localStorage
  useEffect(() => {
    localStorage.setItem("gameData", JSON.stringify(state));
  }, [state]);

  return (
    <>
      {state.currentScreen === "menu" && (
        <GameMenu
          onPvp={() => dispatch({ type: "START_GAME", mode: "pvp" })}
          onPvc={() => dispatch({ type: "START_GAME", mode: "pvc" })}
          onCvc={() => dispatch({ type: "START_GAME", mode: "cvc" })}
        />
      )}
      {state.currentScreen === "bets" && (
        <GameBets
          onBet={(player, bet) =>
            dispatch({ type: "SET_BET", currentBet: player, bet })
          }
          onChangeBet={handleChangeBet}
          handleMenuButton={() =>
            dispatch({ type: "SET_SCREEN", screen: "menu" })
          }
          balance={state.balance}
          bet={state.bet}
        />
      )}

      {state.currentScreen === "game" && (
        <div className="game">
          <div className="game__info">
            <GameHeader
              isRedNext={state.isRedNext}
              winner={state.winner}
              isGameOver={state.isGameOver}
            />
            <GameControls
              handleRetryButton={() => dispatch({ type: "RETRY" })}
              handleMenuButton={() =>
                dispatch({ type: "SET_SCREEN", screen: "menu" })
              }
              handleUndoButton={() => dispatch({ type: "UNDO" })}
              handleRedoButton={() => dispatch({ type: "REDO" })}
            />
          </div>
          <Board
            gameBoard={state.gameBoard}
            handleClick={makeMove}
            winningCells={state.winningCells}
            // если игрок уже сходил в pvc или это cvc то по доске нельзя кликнуть
            disabled={isComputerMove}
          />
        </div>
      )}
      {state.currentScreen === "results" && (
        <GameResults
          winner={state.winner}
          isGameOver={state.isGameOver}
          balance={state.balance}
          handleMenuButton={() =>
            dispatch({ type: "SET_SCREEN", screen: "menu" })
          }
          handleRetryButton={() => dispatch({ type: "RETRY" })}
          gameMode={state.gameMode}
          currentBet={state.currentBet}
          handleValidator={() =>
            dispatch({ type: "SET_SCREEN", screen: "validator" })
          }
        />
      )}

      {state.currentScreen === "validator" && (
        <ValidatorScreen
          handleMenuButton={() =>
            dispatch({ type: "SET_SCREEN", screen: "menu" })
          }
          turnHistory={state.turnHistory}
        />
      )}
    </>
  );
};

export default Game;
