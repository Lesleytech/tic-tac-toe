import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { SocketContext } from '../context/SocketContext';

import styles from './Feedback.module.css';

export default function Feedback({
  winner,
  setWinner,
  player,
  room,
  nextPlayer,
  multiplayer,
  setSquares,
  setIsX,
}) {
  const [socket] = useContext(SocketContext);
  const [redirect, setRedirect] = useState(false);

  const handlePlayAgain = () => {
    if (multiplayer) {
      socket.emit('playAgain', nextPlayer);
    } else {
      setSquares(Array(9).fill(null));
      setIsX(nextPlayer === 'X' ? true : false);
    }

    setWinner('');
  };

  const handleExit = () => {
    if (multiplayer) {
      socket.emit('exitGame', room);
    } else {
      setRedirect(true);
    }

    setWinner('');
  };

  if (redirect) {
    return <Redirect to='/' />;
  }
  return (
    <div className={styles.container}>
      <h2>
        {player === winner
          ? 'You win!'
          : winner === 'tie'
          ? 'It was a tie!'
          : multiplayer
          ? `Player ${winner} wins`
          : 'You lose!'}
      </h2>
      <div>
        <button className={styles.button} onClick={handlePlayAgain}>
          <i className='fa fa-undo' aria-hidden='true'></i> Play again
        </button>
        <Link to='/'>
          <button className={styles.button} onClick={handleExit}>
            <i className='fa fa-times' aria-hidden='true'></i> Exit
          </button>
        </Link>
      </div>
    </div>
  );
}
