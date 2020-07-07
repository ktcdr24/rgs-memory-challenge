import React, { FunctionComponent, useState } from 'react';
import utils from 'utils';

const Cell: FunctionComponent = ({
  cellId,
  cellWidth,
  isChallenge,
  isPicked,
  gameStatus,
}) => {
  let cellStatus = CellStatus.NORMAL;
  if (gameStatus === GameStatus.CHALLENGE && isChallenge) {
    cellStatus = CellStatus.HIGHLIGHT;
  } else if (gameStatus === GameStatus.LOST && isChallenge) {
    cellStatus = CellStatus.HIGHLIGHT;
  } else if (gameStatus === GameStatus.PLAYING && isPicked) {
    cellStatus = isChallenge ? CellStatus.CORRECT : CellStatus.WRONG;
  }
  console.log('Cell', cellId, 'Status', cellStatus);
  return (
    <div
      className="cell"
      style={{ width: `${cellWidth}%`, backgroundColor: cellStatus }}
    >
      &nbsp;
    </div>
  );
};

const GameSession: FunctionComponent = ({
  cellIds,
  cellWidth,
  challengeCellIds,
  playSeconds,
}) => {
  const [gameStatus, setGameStatus] = useState(GameStatus.NEW);
  const [pickedCellIds, setPickedCellIds] = useState([]);
  const [countdown, setCountdown] = useState(playSeconds);

  console.log('challengeCellIds', challengeCellIds);
  console.log('pickedCellIds', pickedCellIds);

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
      />,
    );
  });

  return (
    <div className="game">
      <div className="grid">{cells}</div>
      <div className="message">
        [{gameStatus}] {Messages[gameStatus]}
      </div>
      <div className="button">
        <button onClick={() => setGameStatus(GameStatus.CHALLENGE)}>
          Start Game
        </button>
      </div>
    </div>
  );
};

const GameGenerator: FunctionComponent = () => {
  const rows = 3;
  const cols = 3;
  const challengeSize = 5;
  const challengeSeconds = 3;
  const maxWrongAttempts = 3;
  const playSeconds = 10;

  const cellIds = utils.createArray(rows * cols);
  const challengeCellIds = utils.sampleArray(cellIds, challengeSize).sort();
  const cellWidth = 100 / cols;

  return (
    <GameSession
      cellIds={cellIds}
      cellWidth={cellWidth}
      challengeCellIds={challengeCellIds}
      playSeconds={playSeconds}
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
