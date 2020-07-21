import React from 'react';

import styles from './Board.module.css';
import Square from './Square';

export default function Board({ squares }) {
  return (
    <div className={styles.board}>
      {squares.map((val, index) => (
        <Square value={val} id={index} key={index} />
      ))}
    </div>
  );
}
