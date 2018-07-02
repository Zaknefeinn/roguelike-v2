import React from 'react';

export default props => {
  return (
    <div>
      <h1>{props.stats.attack}</h1>
      <h1>{props.stats.health}</h1>
      <h1>{props.stats.level}</h1>
      <h1>{props.stats.nextLevel}</h1>
      <h1>{props.stats.weapon}</h1>
    </div>
  );
};
