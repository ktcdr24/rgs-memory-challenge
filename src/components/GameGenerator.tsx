import React, { FunctionComponent, useState } from 'react';
import utils from 'utils';
import GameSession from './GameSession';

const useGameId = () => {
  const [gameId, setGameId] = useState(1);

  return {
    gameId,
    isNewGame: gameId === 1,
    renewGame: () => setGameId((gameId) => gameId + 1),
  };
};

interface GameGeneratorProps {
  gridSize: number;
  challengeSize: number;
  challengeSeconds: number;
  playSeconds: number;
  maxWrongAttempts: number;
}

const GameGenerator: FunctionComponent = ({
  gridSize,
  challengeSize,
  challengeSeconds,
  playSeconds,
  maxWrongAttempts,
}) => {
  const { gameId, isNewGame, renewGame } = useGameId();
  const rows = gridSize;
  const cols = gridSize;

  const cellIds = utils.createArray(rows * cols);
  const challengeCellIds = utils.sampleArray(cellIds, challengeSize).sort();
  const cellWidth = 100 / cols;

  return (
    <GameSession
      key={gameId}
      cellIds={cellIds}
      cellWidth={cellWidth}
      challengeCellIds={challengeCellIds}
      playSeconds={playSeconds}
      challengeSeconds={challengeSeconds}
      maxWrongAttempts={maxWrongAttempts}
      startNewSession={renewGame}
      shouldAutoStart={!isNewGame}
    />
  );
};

export default GameGenerator;
