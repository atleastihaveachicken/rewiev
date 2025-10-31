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
import {drawCheck, cloneBoard, emptyBoard } from "./utils/gameHelpers"
import PvcBets from "./components/PvcBets";
import GameResults from "./components/GameResult";
import ValidatorScreen from "./components/ValidatorScreen";


const Game = () => {
   const savedData = JSON.parse(localStorage.getItem('gameData') || '{}'); 
  //стейты для ставок в свс режиме
  const [bet, setBet] = useState<number>(savedData.bet ?? 200);
  const [currentBet, setCurrentBet] = useState<player | null>(savedData.currentBet ?? null);
  const [balance, setBalance] = useState<number>(savedData.balance ?? 1000);
  //сохраняю историю ходов для кнопкок анду/реду 
  const [gameHistory, setGameHistory] = useState<BoardType[]>(savedData.gameHistory ?? []);
  const [currentMove, setCurrentMove] = useState(savedData.currentMove ?? 0);
  const [turnHistory, setTurnHistory] = useState<number[]>(savedData.turnHistory ?? []);
//для игры - доска, игровые режимы и смена очередности ходов
  const [winningCells, setWinningCells] = useState<[number, number][]>(savedData.winningCells ?? []);
  const [gameBoard, setGameBoard] = useState(savedData.gameBoard ?? emptyBoard);
  const [isRedNext, setRedNext] = useState(savedData.isRedNext ?? true);
  const [isGameOver, setIsGameOver] = useState(savedData.isGameOver ?? false);
  const [winner, setWinner] = useState<player | null>(savedData.winner ?? null);
  const [gameMode, setGameMode] = useState<"pvp" | "pvc" | "cvc">(savedData.gameMode ?? 'pvp');
  const [currentScreen, setCurrentScreen] = useState(savedData.currentScreen ?? 'menu');

  // оформление хода такое: вначале срабатывает хендлмув
  // -> он вызывает мейкмув, а мейкмув делает ход и отдает тру/фолс
  const makeMove = (colIndex: colIndex, currentPlayer: player) => {
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
          newBoard
        ];
        setGameHistory(nextHistory);
        //сохраняю историю ходов, чтобы по кнопке validator получать из них объект (в utils функция)
        setTurnHistory((prev) => [...prev, colIndex]);
        setCurrentMove(nextHistory.length - 1);
        setGameBoard(newBoard);
        const winResult = winnerCheck(newBoard, currentPlayer)
        if (winResult?.who) {
          setWinner(winResult?.who);
          setIsGameOver(true);
          setWinningCells(winResult.positions);
          setTimeout(()=> {
            setCurrentScreen('results')
          }, 2000)
          
          if(gameMode === 'pvc') {
            setBalance(prev => prev + 200)
          } else if (gameMode === 'cvc'){
          if (currentBet === winResult?.who) {
            setBalance(prev=> prev + bet * 2)
          }}
        } else if (drawCheck(newBoard)) {
          setBalance(prev => prev + bet)
          setIsGameOver(true);
          setTimeout(()=> {
            setCurrentScreen('results')
          }, 2000)
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
//ход компьютера 
  useEffect(() => {
      if (isGameOver || currentScreen !== "game") return;
      const timer = setTimeout(() => {

        if (gameMode === 'pvc' && !isRedNext) {
       const currentPlayer = 'player_2'
    const computerCol = computerMove(gameBoard, currentPlayer);

    if (computerCol !== -1) {
      const moveMade = makeMove(computerCol, currentPlayer);
      if (moveMade) {
        setRedNext(!isRedNext);
      }
    } 
  } else if (gameMode === 'cvc') {
    const currentPlayer = isRedNext ? 'player_1' : 'player_2'
    const computerCol = computerMove(gameBoard, currentPlayer);

    if (computerCol !== -1) {
      const moveMade = makeMove(computerCol, currentPlayer);
      if (moveMade) {
        setRedNext(!isRedNext);
      }
    } 

  }
      }, 800);
      return () => clearTimeout(timer);
    
  }, [gameMode, isRedNext, isGameOver, currentScreen, makeMove, gameBoard]);

  const handleRetryButton = () => {
    gameMode === 'cvc'? setCurrentScreen('bets') : setCurrentScreen('game');
    setCurrentBet(null);
    setWinner(null);
    setGameBoard(emptyBoard);
    setRedNext(true);
    setIsGameOver(false);
    setCurrentMove(0);
    setGameHistory([]);
    setTurnHistory([]);
    setWinningCells([]);
    
  };
  
  const startGame = (mode: typeof gameMode) => {
    setGameMode(mode);
    if (mode === 'cvc') {
      setCurrentScreen("bets")
    } else {
    setCurrentScreen("game") };
  };

  const handleMenuButton = () => {
    handleRetryButton();
    setCurrentScreen("menu");
  };
  const handleUndoButton = () => {
    // если ходов вообще не было, то кнопка анду делает кнопку ретрай
    if (currentMove === 0) {
      handleRetryButton();
      return;
    }
    // если режим на два игрока, то убираю один ход
    if (gameMode === "pvp" || gameMode === 'cvc') {
      if (currentMove > 0) {
        setCurrentMove(currentMove - 1);
        setGameBoard(gameHistory[currentMove - 1]);
        setRedNext(!isRedNext);
        setIsGameOver(false);
      }
    }
    // убирать один ход на игре против компьютера как-то бессмысленно 
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
      if (gameMode === "pvp" || gameMode === 'cvc') {
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
  const handleChangeBet = (string:string) =>{
    if (string === 'dec') {
      setBet(prev => Math.max(100, prev - 100));
    } else if (string = 'inc') {
      setBet(prev => Math.min(balance, prev + 100))
    }
  }
  const handleValidator = () => {
    console.log(validator(turnHistory));
    setCurrentScreen('validator')
  };

  const handleBet = (player:player, bet:number) => {
   const newBet = {player: player, amount: bet}
   setBet(newBet.amount);
   setCurrentBet(newBet.player);
   setBalance(prev => prev - newBet.amount);
  setCurrentScreen('game')  
};

  const isComputerMove = (gameMode === "pvc" && !isRedNext) || gameMode === 'cvc';
//сохраняю данные игры в локал сторедж
  useEffect(() => {
     const gameData = {
    balance,
    gameBoard,
    gameMode,
    currentScreen,
    isRedNext,
    isGameOver, 
    winner,
    gameHistory,
    turnHistory,
    currentMove,
    bet,
    currentBet,
    winningCells
    
  };
  localStorage.setItem('gameData', JSON.stringify(gameData))
  }, [balance,
    gameMode,
    gameBoard,
    currentScreen,
    isRedNext,
    isGameOver,
    winner,
    gameHistory,
    turnHistory,
    currentMove, 
    bet,
    currentBet,
    winningCells
    ])


  return (
    <>
      {currentScreen === "menu" && (
        <GameMenu
          onPvp={() => startGame("pvp")}
          onPvc={() => startGame("pvc")}
          onCvc={() => startGame("cvc")}
        />
      )}
      {currentScreen === "bets" && (
        <PvcBets
        onChangeBet={handleChangeBet}
        bet={bet}
        onBet={handleBet}
        balance={balance}
        handleMenuButton={handleMenuButton}
        /> 
      )}

      {currentScreen === "game" && (
        <>
          <div className="game">
            <div className="game__info">
              <GameHeader
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
              winningCells={winningCells}
              // если игрок уже сходил в pvc или это cvc то по доске нельзя кликнуть  
              disabled={isComputerMove}
            />
          </div>
        </>
      )}
      {currentScreen === 'results' && (
        <GameResults 
        gameMode={gameMode}
        isGameOver={isGameOver}
        winner={winner}
        balance={balance}
        currentBet={currentBet}
        handleRetryButton={handleRetryButton}
        handleMenuButton={handleMenuButton}
        handleValidator={handleValidator}
        />
        
      )}

      {currentScreen === 'validator' && (
        <ValidatorScreen 
        handleMenuButton={handleMenuButton}
        turnHistory={turnHistory}/>
      )}
    </>
  );
};

export default Game;
