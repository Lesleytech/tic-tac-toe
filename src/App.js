import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomeScreen, PlayScreen } from './screens';
import { HomeProvider } from './context/HomeContext';
import { GameProvider } from './context/GameContext';
import { SocketProvider } from './context/SocketContext';
import { MessagesProvider } from './context/MessagesContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <GameProvider>
          <HomeProvider>
            <Route component={HomeScreen} exact path='/' />
          </HomeProvider>
          <MessagesProvider>
            <SocketProvider>
              <Route component={PlayScreen} exact path='/play' />
            </SocketProvider>
          </MessagesProvider>
        </GameProvider>
      </UserProvider>
    </Router>
  );
}
