import React, { FunctionComponent, useState, useEffect } from 'react';
import utils from 'utils';
import GameStatus from './GameStatus';
import Cell from './Cell';
import Footer from './Footer';

const GameSession: FunctionComponent = ({
  cellIds,
  cellWidth,
  challengeCellIds,
  playSeconds,
  challengeSeconds,
  maxWrongAttempts,
  startNewSession,
  shouldAutoStart,
}) => {
  const [gameStatus, setGameStatus] = useState(
    shouldAutoStart ? GameStatus.CHALLENGE : GameStatus.NEW,
  );
  const [pickedCellIds, setPickedCellIds] = useState([]);
  const [countdownSeconds, setCountdownSeconds] = useState(playSeconds);

  useEffect(() => {
    if (gameStatus === GameStatus.CHALLENGE) {
      const timerId = setTimeout(
        () => setGameStatus(GameStatus.PLAYING),
        1000 * challengeSeconds,
      );
      return () => clearTimeout(timerId);
    }
    if (gameStatus === GameStatus.PLAYING) {
      const timerId = setInterval(() => {
        setCountdownSeconds((cdn) => {
          console.log('cdn', cdn);
          if (cdn === 1) {
            clearTimeout(timerId);
            setGameStatus(GameStatus.LOST);
          }
          return cdn - 1;
        });
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [challengeSeconds, gameStatus]);

  useEffect(() => {
    const [correctPicks, wrongPicks] = utils.arrayCrossCounts(
      pickedCellIds,
      challengeCellIds,
    );
    if (correctPicks === challengeCellIds.length) {
      setGameStatus(GameStatus.WON);
    }
    if (wrongPicks === maxWrongAttempts) {
      setGameStatus(GameStatus.LOST);
    }
  }, [pickedCellIds, challengeCellIds, maxWrongAttempts]);

  const pickCell = (cellId) => {
    if (gameStatus === GameStatus.PLAYING) {
      console.log('pickCell', cellId);
      setPickedCellIds((pickedCellIds: number[]) => {
        if (pickedCellIds.includes(cellId)) {
          return pickedCellIds;
        } else {
          return pickedCellIds.concat(cellId);
        }
      });
    }
  };

  const cells = [];
  cellIds.map((cellId) => {
    cells.push(
      <Cell
        key={cellId}
        cellId={cellId}
        cellWidth={cellWidth}
        isChallenge={challengeCellIds.includes(cellId)}
        isPicked={pickedCellIds.includes(cellId)}
        gameStatus={gameStatus}
        onClick={() => pickCell(cellId)}
      />,
    );
  });

  return (
    <div className="game">
      <div className="grid">{cells}</div>
      <Footer
        gameStatus={gameStatus}
        startPlaying={() => setGameStatus(GameStatus.CHALLENGE)}
        startNewSession={startNewSession}
        countdownSeconds={countdownSeconds}
      />
    </div>
  );
};

export default GameSession;
