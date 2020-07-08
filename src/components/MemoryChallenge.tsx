import React, { FunctionComponent, useState, useEffect } from 'react';
import utils from 'utils';

const Cell: FunctionComponent = ({
  cellId,
  cellWidth,
  isChallenge,
  isPicked,
  gameStatus,
  onClick,
}) => {
  let cellStatus = CellStatus.NORMAL;
  switch (gameStatus) {
    case GameStatus.CHALLENGE:
      if (isChallenge) {
        cellStatus = CellStatus.HIGHLIGHT;
      }
      break;
    case GameStatus.WON:
    case GameStatus.LOST:
      if (isChallenge) {
        cellStatus = CellStatus.HIGHLIGHT;
      } else if (isPicked) {
        cellStatus = isChallenge ? CellStatus.CORRECT : CellStatus.WRONG;
      }
      break;
    case GameStatus.PLAYING:
      if (isPicked) {
        cellStatus = isChallenge ? CellStatus.CORRECT : CellStatus.WRONG;
      }
  }
  // console.log('Cell', cellId, 'Status', cellStatus);
  return (
    <div
      className="cell"
      style={{ width: `${cellWidth}%`, backgroundColor: cellStatus }}
      onClick={onClick}
    >
      &nbsp;
    </div>
  );
};

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

  console.log('challengeCellIds', challengeCellIds);
  console.log('pickedCellIds', pickedCellIds);

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
    if (gameStatus === GameStatus.PLAYING) {
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
    }
  }, [pickedCellIds, challengeCellIds, maxWrongAttempts, gameStatus]);

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

const GameGenerator: FunctionComponent = () => {
  const [gameId, setGameId] = useState(1);
  const rows = 3;
  const cols = 3;
  const challengeSize = 5;
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

const GameStatus = {
  NEW: 'NEW',
  CHALLENGE: 'CHALLENGE',
  PLAYING: 'PLAYING',
  WON: 'WON',
  LOST: 'LOST',
};

const CellStatus = {
  NORMAL: 'white',
  HIGHLIGHT: 'lightblue',
  CORRECT: 'lightgreen',
  WRONG: 'pink',
};

const Messages = {
  NEW: 'You will have a few seconds to memorize the blue random cells',
  CHALLENGE: 'Remember these blue cells now',
  PLAYING: 'Which cells were blue?',
  WON: 'Victory!',
  LOST: 'Game Over',
};

export default GameGenerator;
