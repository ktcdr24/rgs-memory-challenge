import React, { FunctionComponent, useState } from 'react';
import utils from 'utils';
import GameSession from './GameSession';

const GameGenerator: FunctionComponent = () => {
  const [gameId, setGameId] = useState(1);
  const rows = 6;
  const cols = 6;
  const challengeSize = 10;
  const challengeSeconds = 3;
  const maxWrongAttempts = 3;
  const playSeconds = 10;

  const cellIds = utils.createArray(rows * cols);
  const challengeCellIds = utils.sampleArray(cellIds, challengeSize).sort();
  const cellWidth = 100 / cols;

  const startNewSession = () => {
    console.log('Starting new game session');
    setGameId((gameId) => gameId + 1);
  };

  return (
    <GameSession
      key={gameId}
      cellIds={cellIds}
      cellWidth={cellWidth}
      challengeCellIds={challengeCellIds}
      playSeconds={playSeconds}
      challengeSeconds={challengeSeconds}
      maxWrongAttempts={maxWrongAttempts}
      startNewSession={startNewSession}
      shouldAutoStart={gameId > 1}
    />
  );
};

export default GameGenerator;
