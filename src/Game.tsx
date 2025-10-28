import { useEffect, useState } from "react";
import "./Game.css";
import Board from "./components/Board";
import GameControls from "./components/GameControls";
import GameHeader from "./components/GameHeader";
import type { colIndex, BoardType, player } from "./types/game.types";
import winnerCheck from "./utils/winnerCheck";
import GameMenu from "./components/GameMenu";
import computerMove from "./utils/computerMove";
import validator from "./utils/validator";

const Game = () => {
  const emptyBoard = Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));
  const [gameHistory, setGameHistory] = useState<BoardType[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [turnHistory, setTurnHistory] = useState<number[]>([]);

  const [gameBoard, setGameBoard] = useState(emptyBoard);
  const [isRedNext, setRedNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<player | null>(null);
  const [gameMode, setGameMode] = useState<"pvp" | "pvc">("pvp");
  const [currentScreen, setCurrentScreen] = useState("menu");

  // оформление хода такое: вначале срабатывает хендлмув
  // -> он вызывает мейкмув, а мейкмув делает ход и отдает тру/фолс
  const makeMove = (colIndex: colIndex, currentPlayer: player) => {
    const cloneBoard = (board: BoardType) => board.map((row) => [...row]);
    const newBoard = cloneBoard(gameBoard);
    let moveMade = false;
    if (isGameOver) return moveMade;
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][colIndex] === null) {
        newBoard[row][colIndex] = currentPlayer;
        moveMade = true;
        //сохраняю историю игры чтобы работали кнопки undo/redo
        const nextHistory = [
          ...gameHistory.slice(0, currentMove + 1),
          cloneBoard(newBoard),
        ];
        setGameHistory(nextHistory);
        //сохраняю историю ходов, чтобы по кнопке validator получать из них объект (в utils функция)
        setTurnHistory((prev) => [...prev, colIndex]);
        setCurrentMove(nextHistory.length - 1);
        setGameBoard(cloneBoard(newBoard));

        if (winnerCheck(newBoard, currentPlayer)) {
          setWinner(currentPlayer);
          setIsGameOver(true);
        } else if (drawCheck(newBoard)) {
          setIsGameOver(true);
        }
        break;
      }
    }
    return moveMade;
  };

  const handleMove = (colIndex: colIndex) => {
    if (isGameOver) {
      return;
    }
    const currentPlayer = isRedNext ? "player_1" : "player_2";
    const moveMade = makeMove(colIndex, currentPlayer);
    if (moveMade && !isGameOver) {
      setRedNext(!isRedNext);
    }
  };

  const handleComputerMove = () => {
    const computerPlayer = "player_2";
    const cloneBoard = (board: BoardType) => board.map((row) => [...row]);
    const newBoard = cloneBoard(gameBoard);
    const computerCol = computerMove(newBoard, computerPlayer);

    if (computerCol !== -1) {
      const moveMade = makeMove(computerCol, computerPlayer);
      if (moveMade) {
        setRedNext(!isRedNext);
      }
    }
  };
//ход компьютера 
  useEffect(() => {
    if (
      gameMode === "pvc" &&
      !isRedNext &&
      !isGameOver &&
      currentScreen === "game"
    ) {
      const timer = setTimeout(() => {
        handleComputerMove();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameMode, isRedNext, isGameOver, currentScreen]);

  const handleRetryButton = () => {
    setWinner(null);
    setGameBoard(emptyBoard);
    setRedNext(true);
    setIsGameOver(false);
    setCurrentMove(0);
    setGameHistory([]);
    setTurnHistory([]);
  };
  const drawCheck = (board: BoardType) => {
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) {
        return false;
      }
    }
    return true;
  };

  const startGame = (mode: typeof gameMode) => {
    setGameMode(mode);
    setCurrentScreen("game");
  };

  const handleMenuButton = () => {
    setCurrentScreen("menu");
    setGameBoard(emptyBoard);
    setRedNext(true);
    setIsGameOver(false);
    setWinner(null);
    setCurrentMove(0);
    setGameHistory([]);
  };
  const handleUndoButton = () => {
    // если ходов вообще не было, то кнопка анду делает кнопку ретрай
    if (currentMove === 0) {
      handleRetryButton();
      return;
    }
    // если режим на два игрока, то убираю один ход
    if (gameMode === "pvp") {
      if (currentMove > 0) {
        setCurrentMove(currentMove - 1);
        setGameBoard(gameHistory[currentMove - 1]);
        setRedNext(!isRedNext);
        setIsGameOver(false);
      }
    }
    // убирать один ход на игре против компьютера бессмысленно - он сможет сходить по-другому только если центр занят)
    // поэтому анду убирает два хода: ход компьютера и игрока
    else if (gameMode === "pvc") {
      if (currentMove >= 2) {
        setCurrentMove(currentMove - 2);
        setGameBoard(gameHistory[currentMove - 2]);
        setIsGameOver(false);
        setRedNext(true);
      } // после одного хода кнопка анду делает каррент мув -1,
      // поэтому дополнительно проверяем этот момент и вызываем функционал ретрай баттон
      else if (currentMove === 1) {
        handleRetryButton();
      }
    }
  };

  const handleRedoButton = () => {
    if (currentMove < gameHistory.length - 1) {
      if (gameMode === "pvp") {
        setCurrentMove(currentMove + 1);
        setGameBoard(gameHistory[currentMove + 1]);
        setRedNext(!isRedNext);
      } else if (gameMode === "pvc") {
        if (currentMove < gameHistory.length - 3) {
          setCurrentMove(currentMove + 2);
          setGameBoard(gameHistory[currentMove + 2]);
          setRedNext(true);
        }
      }
    }
  };

  const handleValidator = () => {
    console.log(validator(turnHistory));
  };
  return (
    <>
      {currentScreen === "menu" && (
        <GameMenu
          onPvp={() => startGame("pvp")}
          onPvc={() => startGame("pvc")}
        />
      )}

      {currentScreen === "game" && (
        <>
          <div className="game">
            <div className="game__info">
              <GameHeader
                isGameOver={isGameOver}
                isRedNext={isRedNext}
                winner={winner}
              />
              <GameControls
                handleRetryButton={handleRetryButton}
                handleMenuButton={handleMenuButton}
                handleUndoButton={handleUndoButton}
                handleRedoButton={handleRedoButton}
                handleValidator={handleValidator}
              />
            </div>
            <Board
              gameBoard={gameBoard}
              handleClick={handleMove}
              // если игрок уже сходил в pvc то по доске нельзя кликнуть из-за pointer-events: none 
              disabled={gameMode === "pvc" && !isRedNext}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Game;
