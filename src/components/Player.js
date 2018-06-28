import React from 'react';

const Player = props => {
  const height = props.y * 25;
  const width = props.x * 25;
  return (
    <div>
      <span className="tile player" style={{ top: height, left: width }} />
    </div>
  );
};
export default Player;
