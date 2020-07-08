import React, { FunctionComponent } from 'react';
import GameStatus from './GameStatus';

const CountdownTimer: FunctionComponent = ({ countdownSeconds }) => {
  return <div>Time Remaining: {countdownSeconds}</div>;
};

const Footer: FunctionComponent = ({
  gameStatus,
  startPlaying,
  startNewSession,
  countdownSeconds,
}) => {
  const buttonAreaContent = () => {
    switch (gameStatus) {
      case GameStatus.NEW:
        return <button onClick={startPlaying}>Start Game</button>;
      case GameStatus.WON:
      case GameStatus.LOST:
        return <button onClick={startNewSession}>Play Again</button>;
      case GameStatus.PLAYING:
        return <CountdownTimer countdownSeconds={countdownSeconds} />;
    }
  };
  return (
    <>
      <div className="message">
        [{gameStatus}] {Messages[gameStatus]}
      </div>
      <div className="button">{buttonAreaContent()}</div>
    </>
  );
};

const Messages = {
  NEW: 'You will have a few seconds to memorize the blue random cells',
  CHALLENGE: 'Remember these blue cells now',
  PLAYING: 'Which cells were blue?',
  WON: 'Victory!',
  LOST: 'Game Over',
};

export default Footer;
