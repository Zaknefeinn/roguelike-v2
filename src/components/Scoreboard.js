import React from 'react';

export const Scoreboard = props => {
  return (
    <div>
      <h1>ATK {props.stats.attack}</h1>
      <h1>HP {props.stats.health}</h1>
      <h1>DUNGEON LEVEL {props.level}</h1>
      <h1>PLAYER LEVEL {props.stats.level}</h1>
      <h1>XP {props.stats.nextLevel}</h1>
      <h1>WEP {props.stats.weapon}</h1>
    </div>
  );
};
