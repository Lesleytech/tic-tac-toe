import React, { useContext } from 'react';

import styles from './Square.module.css';

import { GameContext } from '../context/GameContext';
import { SocketContext } from '../context/SocketContext';
import { UserContext } from '../context/UserContext';

export default function Square({ value, id }) {
  const {
    squares: _squares,
    isX: _isX,
    multiplayer: _multiplayer,
  } = useContext(GameContext);
  const { player: _player } = useContext(UserContext);
  const [squares, setSquares] = _squares;
  const [isX, setIsX] = _isX;
  const [player] = _player;
  const [multiplayer] = _multiplayer;

  const [socket] = useContext(SocketContext);

  const handleClickSP = () => {
    const newSquares = [...squares];

    if (!newSquares[id]) {
      newSquares[id] = isX ? 'X' : 'O';
      setSquares(newSquares);
      setIsX(!isX);
    }
  };

  const handleClickMP = () => {
    const newSquares = [...squares];

    const canPlay =
      !newSquares[id] && ((isX && player === 'X') || (!isX && player === 'O'));

    if (canPlay) {
      newSquares[id] = isX ? 'X' : 'O';

      setSquares(newSquares);
      setIsX(!isX);

      socket.emit('userPlayed', { squares: newSquares, isX: !isX });
    }
  };

  return (
    <div
      id={`square_${id}`}
      className={styles.square}
      onClick={multiplayer ? handleClickMP : handleClickSP}
      style={{
        cursor:
          !squares[id] && ((isX && player === 'X') || (!isX && player === 'O'))
            ? 'pointer'
            : 'not-allowed',
        pointerEvents: !multiplayer
          ? !squares[id] && isX
            ? 'auto'
            : 'none'
          : squares[id]
          ? 'none'
          : 'auto',
      }}
    >
      {value === 'O' ? (
        <svg className={styles.svg} width='100' height='100'>
          <circle
            cx='50'
            cy='50'
            r='40'
            stroke='#f44'
            strokeWidth='10'
            fill='none'
          />
        </svg>
      ) : value === 'X' ? (
        <svg className={styles.svg} width='100' height='100'>
          <line
            x1='10'
            y1='10'
            x2='90'
            y2='90'
            stroke='#f44'
            strokeWidth='10'
          />
          <line
            x1='90'
            y1='10'
            x2='10'
            y2='90'
            stroke='#f44'
            strokeWidth='10'
          />
        </svg>
      ) : (
        ''
      )}
    </div>
  );
}
