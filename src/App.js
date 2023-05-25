import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const curPlayer = (currentMove % 2) ? 'O' : 'X'
  const currentBoard = history[currentMove]

  function handlePlay(nextBoard) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextBoard]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove)
  }

  const moves = history.map((board, move) => {
    const label = (move > 0) ? `go to move ${move}` : 'Go to game start'
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{label}</button>
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board curPlayer={curPlayer} board={currentBoard} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Board({ curPlayer, board, onPlay }) {
  function handleClick(i) {
    // bail out if the square is already played or the game has already been won
    if (board[i] || evalGame(board)) {
      return
    }

    const nextBoard = board.slice()
    nextBoard[i] = curPlayer
    onPlay(nextBoard)
  }

  const gameResult = evalGame(board)
  const status = gameResult ? gameResult : `${curPlayer}'s turn...`

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Cell value={board[0]} onCellClick={() => handleClick(0)} />
        <Cell value={board[1]} onCellClick={() => handleClick(1)} />
        <Cell value={board[2]} onCellClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Cell value={board[3]} onCellClick={() => handleClick(3)} />
        <Cell value={board[4]} onCellClick={() => handleClick(4)} />
        <Cell value={board[5]} onCellClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Cell value={board[6]} onCellClick={() => handleClick(6)} />
        <Cell value={board[7]} onCellClick={() => handleClick(7)} />
        <Cell value={board[8]} onCellClick={() => handleClick(8)} />
      </div>
    </>
  )
}

function Cell({ value, onCellClick }) {
  return (
    <button className="cell" onClick={onCellClick}>
      {value}
    </button>
  )
}

function evalGame(board) {
  const winScenarios = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let winScenario of winScenarios) {
    const winner = boardContainsWinScenario(board, winScenario)
    if (winner) return `${winner} won the game`
    for (let cell of board) {
      if (!cell) return null
    }
    return(`Cat's game.`)
  }
}

function boardContainsWinScenario(board, winScenario) {
  const [a, b, c] = winScenario

  // if all three spots in the win combo are occupied by the same token,
  // we have a winner!
  return (board[a] && (board[a] === board[b]) &&
    (board[a] === board[c])) ? board[a] : null
}
