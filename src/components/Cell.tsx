import React, { FunctionComponent } from 'react';
import GameStatus from './GameStatus';
import CellStatus from './CellStatus';

const Cell: FunctionComponent = ({
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

export default Cell;
