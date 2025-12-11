import { useState } from "react";

function Header({ xScore, oScore }) {
  return (
    <header className="header">
      <h2 id="pointsX">X: {xScore}</h2>
      <h1>Tic Tac Toe</h1>
      <h2 id="pointsO">O: {oScore}</h2>
    </header>
  );
}

function Square({ value, onSquareClick, isWinning }) {
  let squareClass = "square";
  if (value === "X") {
    squareClass += " x-mark";
  } else if (value === "O") {
    squareClass += " o-mark";
  }
  if (isWinning) {
    squareClass += " winning-square";
  }
  
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ onGameEnd, resetTrigger, currentFirstPlayer }) {
  const [xIsNext, setXIsNext] = useState(currentFirstPlayer === "X");
  const [squares, setSquares] = useState(Array(9).fill(null));

  useState(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(currentFirstPlayer === "X");
  }, [resetTrigger, currentFirstPlayer]);

  function handleClick(i) {
    const winnerResult = calculateWinner(squares);
    if (winnerResult.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } 
    else {
      nextSquares[i] = "O";
    }

    setSquares(nextSquares);
    
    const newWinnerResult = calculateWinner(nextSquares);
    const isDraw = !newWinnerResult.winner && nextSquares.every(square => square !== null);
    
    if (newWinnerResult.winner) {
      onGameEnd(newWinnerResult.winner, false);
    } 
    else if (isDraw) {
      onGameEnd(null, true);
    }
    
    setXIsNext(!xIsNext);
  }

  const winnerResult = calculateWinner(squares);
  let status;
  
  if (winnerResult.winner) {
    status = "It's " + (xIsNext ? "X" : "O") + " turn";
  } else {
    status = "It's " + (xIsNext ? "X" : "O") + " turn";
  }

  return (
    <div className="board">
      <div className="status">{status}</div>
      <div className="board-row">
        <Square 
          value={squares[0]} 
          onSquareClick={() => handleClick(0)} 
          isWinning={winnerResult.line && winnerResult.line.includes(0)}
        />
        <Square 
          value={squares[1]} 
          onSquareClick={() => handleClick(1)} 
          isWinning={winnerResult.line && winnerResult.line.includes(1)}
        />
        <Square 
          value={squares[2]} 
          onSquareClick={() => handleClick(2)} 
          isWinning={winnerResult.line && winnerResult.line.includes(2)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={squares[3]} 
          onSquareClick={() => handleClick(3)} 
          isWinning={winnerResult.line && winnerResult.line.includes(3)}
        />
        <Square 
          value={squares[4]} 
          onSquareClick={() => handleClick(4)} 
          isWinning={winnerResult.line && winnerResult.line.includes(4)}
        />
        <Square 
          value={squares[5]} 
          onSquareClick={() => handleClick(5)} 
          isWinning={winnerResult.line && winnerResult.line.includes(5)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={squares[6]} 
          onSquareClick={() => handleClick(6)} 
          isWinning={winnerResult.line && winnerResult.line.includes(6)}
        />
        <Square 
          value={squares[7]} 
          onSquareClick={() => handleClick(7)} 
          isWinning={winnerResult.line && winnerResult.line.includes(7)}
        />
        <Square 
          value={squares[8]} 
          onSquareClick={() => handleClick(8)} 
          isWinning={winnerResult.line && winnerResult.line.includes(8)}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [firstPlayer, setFirstPlayer] = useState("X"); 
  const [gameResult, setGameResult] = useState({ winner: null, isDraw: false }); 

  function handleGameEnd(winner, isDraw) {
    setGameResult({ winner, isDraw });
    if (winner === "X") {
      setXScore(prevScore => prevScore + 1);
    } 
    else if (winner === "O") {
      setOScore(prevScore => prevScore + 1);
    }
  }

  function handleResetBoard() {
    setGameResult({ winner: null, isDraw: false });
    setFirstPlayer(prev => prev === "X" ? "O" : "X");
    setResetCount(prev => prev + 1);
  }

  return (
    <div className="app">
      <Header xScore={xScore} oScore={oScore} />
      <Board 
        key={resetCount} 
        onGameEnd={handleGameEnd} 
        resetTrigger={resetCount}
        currentFirstPlayer={firstPlayer}
      />
      
      <div className="reset-container">
        <button className="reset-btn" onClick={handleResetBoard}>
          Restart game
        </button>
      </div>
      
      {gameResult.winner && (
        <div className="winner_msg">{gameResult.winner} is the winner!!</div>
      )}
      {gameResult.isDraw && (
        <div className="winner_msg draw-message">It's a draw!</div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }
  return { winner: null, line: null };
}