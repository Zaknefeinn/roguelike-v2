import React from 'react';

export default props => {
  return (
    <div className="container">
      <div className="gameOverContainer">
        <div className="goTop">
          <h1>Game Over</h1>
        </div>
        <div className="goBottom">
          <button onClick={() => props.reset()}>Retry</button>
        </div>
      </div>
    </div>
  );
};
