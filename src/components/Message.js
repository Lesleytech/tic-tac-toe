import React from 'react';
import moment from 'moment';

import styles from './Message.module.css';

export default function Message({ text, sender, self }) {
  return (
    <div
      className={
        self
          ? styles.message_container_sender
          : styles.message_container_receiver
      }
    >
      <div className={styles.message}>
        <small>{!self ? sender : ''}</small>
        <p style={{ marginRight: '25px' }}>{text}</p>
        <small className={styles.time}>{moment().format('LT')}</small>
      </div>
    </div>
  );
}
