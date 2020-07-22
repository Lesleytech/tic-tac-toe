export function getWinner(squares) {
  const winningMoves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningMoves.length; i++) {
    const [a, b, c] = winningMoves[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return squares.indexOf(null) === -1 ? 'tie' : null;
}

export function computer(squares) {
  const winningMoves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //get indexes of null squares
  const nullSquares = [];
  squares.forEach((square, index) => {
    if (!square) {
      nullSquares.push(index);
    }
  });

  const randomSquare =
    nullSquares[Math.floor(Math.random() * nullSquares.length)];

  for (let i = 0; i < winningMoves.length; i++) {
    const [a, b, c] = winningMoves[i];

    //This is a chance for the computer to win
    const winningCounter = squares.filter((square, index) => {
      if (square === 'O' && (index === a || index === b || index === c)) {
        return true;
      } else {
        return false;
      }
    });

    //This is a chance for the opponent to win
    const opponentCounter = squares.filter((square, index) => {
      if (square === 'X' && (index === a || index === b || index === c)) {
        return true;
      } else {
        return false;
      }
    });

    //Handle event for computer to win
    if (
      winningCounter.length > 1 &&
      (!squares[a] || !squares[b] || !squares[c])
    ) {
      if (!squares[a]) {
        setTimeout(() => {
          document.getElementById(`square_${a}`).click();
        }, 1000);
      } else if (!squares[b]) {
        setTimeout(() => {
          document.getElementById(`square_${b}`).click();
        }, 1000);
      } else {
        setTimeout(() => {
          document.getElementById(`square_${c}`).click();
        }, 1000);
      }
      return;

      //Handle event to counter opponent
    } else if (
      opponentCounter.length > 1 &&
      (!squares[a] || !squares[b] || !squares[c])
    ) {
      if (!squares[a]) {
        setTimeout(() => {
          document.getElementById(`square_${a}`).click();
        }, 1000);
      } else if (!squares[b]) {
        setTimeout(() => {
          document.getElementById(`square_${b}`).click();
        }, 1000);
      } else {
        setTimeout(() => {
          document.getElementById(`square_${c}`).click();
        }, 1000);
      }
      return;
    }
  }

  setTimeout(() => {
    squares[4]
      ? document.getElementById(`square_${randomSquare}`).click()
      : document.getElementById('square_4').click();
  }, 1000);
}
