import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Howl } from "howler";

import styles from "./PlayScreen.module.css";
import { Container, Board, Messages, Feedback, Exit } from "../components";

import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import { MessagesContext } from "../context/MessagesContext";
import { UserContext } from "../context/UserContext";

import { getWinner, computer } from "../utils/helper";

const notify = new Howl({
  src: ["notify.mp3"],
});

export default function PlayScreen() {
  const {
    squares: _squares,
    winner: _winner,
    isX: _isX,
    multiplayer: _multiplayer,
    nextPlayer: _nextPlayer,
  } = useContext(GameContext);

  const { user: _user, room: _room, player: _player } = useContext(UserContext);

  const [user] = _user;
  const [room] = _room;
  const [player, setPlayer] = _player;
  const [nextPlayer, setNextPlayer] = _nextPlayer;

  const [socket, setSocket] = useContext(SocketContext);
  const [squares, setSquares] = _squares;
  const [winner, setWinner] = _winner;
  const [isX, setIsX] = _isX;
  const [multiplayer] = _multiplayer;
  const [messages, setMessages] = useContext(MessagesContext);
  const [exit, setExit] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!multiplayer) {
      setPlayer("X");
      setIsX(true);
    } else {
      const _socket = io.connect();
      _socket.emit("joinRoom", {
        user,
        room,
      });

      setSocket(_socket);

      _socket.on("userPlayed", ({ squares, isX }) => {
        setSquares(squares);
        setIsX(isX);
      });

      _socket.on("typing", () => setTyping(true));
      _socket.on("notTyping", () => setTyping(false));

      _socket.on("playAgain", (nextPlayer) => {
        setNextPlayer(nextPlayer === "X" ? "O" : "X");
        setSquares(Array(9).fill(null));
        setWinner("");
      });

      _socket.on("newChallenger", () => {
        console.log("new challenger");
        notify.play();
        setSquares(Array(9).fill(null));
        setExit(false);
      });

      _socket.on("newMessage", () => {
        console.log("new message");
        notify.play();
      });

      _socket.on("exitGame", () => {
        setExit(true);
      });

      if (player === "X") {
        setMessages([
          {
            text: `Welcome to the game ${user}...`,
            sender: "#GameBot",
          },
          {
            text: `You are player X`,
            sender: "#GameBot",
          },
          {
            text: `Challenger will join soon`,
            sender: "#GameBot",
          },
        ]);
      } else {
        setMessages([
          {
            text: `Welcome to the game ${user}...`,
            sender: "#GameBot",
          },
          {
            text: "You are player O",
            sender: "#GameBot",
          },
          {
            text: "Start",
            sender: "#GameBot",
          },
        ]);

        _socket.emit("newChallenger");
      }

      return function () {
        multiplayer && _socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const winner = getWinner(squares);

    if (winner) {
      setWinner(winner);
      !multiplayer && setNextPlayer(nextPlayer === "X" ? "O" : "X");
    } else if (!multiplayer && !isX && player === "X") {
      computer(squares);
    }
  }, [squares]);

  const handleOnChange = (e) => {
    setText(e.target.value);
    socket.emit("typing");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([
      ...messages,
      {
        text,
        sender: user,
        self: true,
      },
    ]);
    setText("");

    socket.emit("newMessage", {
      text,
      sender: user,
    });
    socket.emit("notTyping");
  };

  return (
    <div className={styles.container}>
      <Container>
        <div className={styles.play_container}>
          <div
            className={`${styles.playground} ${styles.playground_sm}`}
            style={{ borderBottom: multiplayer ? "inherit" : "none" }}
          >
            {exit ? (
              <Exit player={player} />
            ) : winner ? (
              <Feedback
                winner={winner}
                setWinner={setWinner}
                player={player}
                room={room}
                nextPlayer={nextPlayer}
                multiplayer={multiplayer}
                setSquares={setSquares}
                setIsX={setIsX}
              />
            ) : (
              <Board squares={squares} />
            )}
          </div>

          {multiplayer && (
            <div className={styles.messaging}>
              <Messages typing={typing} player={player} />
              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Type message"
                  value={text}
                  onChange={handleOnChange}
                  onBlur={() => socket.emit("notTyping")}
                />
              </form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
