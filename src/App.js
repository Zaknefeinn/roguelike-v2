import React, { Component } from 'react';
import Tiles from './components/Tiles';
import Player from './components/Player';
import GameOver from './components/GameOver';
import { Scoreboard } from './components/Scoreboard';
import ROT from 'rot-js';
import './App.css';
import { EnemyStats } from './components/utilities/Combat';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerLoc: { x: 0, y: 0 },
      hasFetched: false,
      map: [],
      enemies: [],
      heals: [],
      weapons: [],
      portal: {},
      stats: {},
      level: 0,
      gameOver: false
    };
  }

  componentDidMount() {
    document.getElementById('root').focus();
    this.generateMap();
  }
  changeState = (key, newState) => {
    this.setState({ [key]: newState });
  };
  reset = () => {
    this.setState(initialState);
    this.generateMap();
  };
  changeEnemyStats = (enemy, newStats) => {
    let enemies = this.state.enemies.slice();
    const enemyIndex = enemies.findIndex(
      cell => cell.x === enemy.x && cell.y === enemy.y
    );
    enemies[enemyIndex].stats.health = newStats;
    if (enemies[enemyIndex].stats.health <= 0) {
      enemies[enemyIndex].class = 'floor';
      enemies[enemyIndex].solid = false;
      this.setState({ hasFetched: false });
    }
    this.setState({ enemies });
  };
  generateMap = () => {
    let map = [];
    const digger = new ROT.Map.Uniform(30, 25);
    digger.create((x, y, v) => {
      let tile = {};
      tile.x = x;
      tile.y = y;
      v === 1
        ? ((tile.class = 'wall'), (tile.solid = true))
        : ((tile.class = 'floor'), (tile.solid = false));
      map.push(tile);
    });
    const filteredMap = map.filter(tile => tile.class !== 'wall');
    this.setState({ map: filteredMap });
    const floors = map.filter(floor => floor.class === 'floor');
    const randomTiles = this.randomTiles(floors);
    const enemies = randomTiles.slice(1, 7);
    enemies.map(
      tile => (
        (tile.class = 'enemy'),
        (tile.solid = true),
        (tile.stats = EnemyStats(this.state.level))
      )
    );
    const heals = randomTiles.slice(7, 11);
    heals.map(tile => (tile.class = 'heal'));
    const weapons = randomTiles.slice(11, 14);
    weapons.map(tile => (tile.class = 'weapon'));
    const portal = randomTiles[14];
    portal.class = 'portal';
    this.setState({
      playerLoc: randomTiles[0],
      enemies: enemies,
      heals: heals,
      weapons: weapons,
      portal: portal
    });
  };

  randomTiles = array => {
    let floors = array;
    let randomTiles = [];
    for (let i = 0; i < 15; i++) {
      const randomLocation = Math.floor(Math.random() * floors.length);
      randomTiles.push(floors[randomLocation]);
      floors.splice(randomLocation, 1);
    }
    return randomTiles;
  };

  render() {
    const { playerLoc, enemies } = this.state;
    return (
      <div className="App">
        <Scoreboard stats={this.state.stats} level={this.state.level} />
        {this.state.gameOver ? (
          <GameOver reset={() => this.reset()} />
        ) : (
          <div className="container">
            <Tiles
              hasFetched={this.state.hasFetched}
              map={this.state.map}
              changeState={(key, newState) => this.changeState(key, newState)}
            />
            <Player
              map={this.state.map}
              changeState={(key, newState) => this.changeState(key, newState)}
              changeEnemyStats={(enemy, stats) =>
                this.changeEnemyStats(enemy, stats)
              }
              x={playerLoc.x}
              y={playerLoc.y}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;

const initialState = {
  playerLoc: { x: 0, y: 0 },
  hasFetched: false,
  map: [],
  enemies: [],
  heals: [],
  weapons: [],
  portal: {},
  stats: {},
  level: 0,
  gameOver: false
};
