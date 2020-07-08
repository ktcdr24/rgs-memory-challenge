import React, { FunctionComponent } from 'react';
import GameGenerator from './GameGenerator';

const App: FunctionComponent = () => {
  return (
    <div>
      <GameGenerator
        gridSize={5}
        playSeconds={10}
        challengeSize={6}
        challengeSeconds={5}
      />
    </div>
  );
};

export default App;
