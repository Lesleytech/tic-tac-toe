import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Exit.module.css';

export default function Exit({ player }) {
  return (
    <div className={styles.container}>
      <h2>Player {player === 'X' ? 'O' : 'X'} left the game</h2>
      <Link to='/'>
        <button className={styles.button}>
          <i className='fa fa-times' aria-hidden='true'></i> Exit
        </button>
      </Link>
    </div>
  );
}
