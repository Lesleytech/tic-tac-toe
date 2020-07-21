import React, { useContext, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

import { MessagesContext } from '../context/MessagesContext';
import { SocketContext } from '../context/SocketContext';

import styles from './Messages.module.css';

import Message from './Message';
export default function Messages({ typing, player }) {
  const [messages, setMessages] = useContext(MessagesContext);
  const [socket] = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        setMessages([...messages, message]);
      });

      socket.on('playAgain', (nextPlayer) => {
        setMessages([
          ...messages,
          { text: 'New round', sender: '#GameBot' },
          {
            text:
              nextPlayer === player
                ? 'You start'
                : `Player ${nextPlayer} starts`,
            sender: '#GameBot',
          },
        ]);
      });

      socket.on('newChallenger', () => {
        setMessages([
          ...messages,
          { text: 'A new challenger joined!', sender: '#GameBot' },
          { text: 'Challenger starts', sender: '#GameBot' },
        ]);
      });
    }
  }, [messages]);
  return (
    <ScrollToBottom className={styles.messages}>
      {messages.map((message, index) => (
        <Message
          text={message.text}
          sender={message.sender}
          time={message.time}
          self={message.self}
          key={index}
        />
      ))}
      <p className={styles.typing}>{typing && 'typing...'}</p>
    </ScrollToBottom>
  );
}
