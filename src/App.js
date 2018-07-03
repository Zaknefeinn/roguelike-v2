import React, { Component } from 'react';
import Tiles from './components/Tiles';
import Player from './components/Player';
import GameOver from './components/GameOver';
import { Scoreboard } from './components/Scoreboard';
import { RandomTiles, LocateCell } from './components/utilities/Map';
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
      portal: {},
      stats: {
        health: 100,
        attack: 7,
        weapon: 'Stick',
        nextLevel: 60,
        level: 1
      },
      level: 0,
      gameOver: false,
      showTooltip: false,
      nextLevel: false
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
  nextLevel = () => {
    this.setState({ level: this.state.level + 1 });
    this.setState({ hasFetched: false, nextLevel: true });
    this.generateMap();
  };
  removeCell = cell => {
    const map = [...this.state.map];
    const mapIndex = LocateCell(map, cell);
    map[mapIndex].class = 'floor';
    map[mapIndex].solid = false;
    this.setState({ hasFetched: false });
    this.setState({ map });
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
    const randomTiles = RandomTiles(map.filter(tile => tile.class !== 'wall'));
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
    console.log(randomTiles[0]);
    this.setState({
      playerLoc: randomTiles[0],
      portal: portal
    });
  };

  render() {
    const { playerLoc } = this.state;
    let toolTip;
    if (this.state.showTooltip) {
      toolTip = (
        <div id="next-level">
          <h1>Press space to go to the next level</h1>
        </div>
      );
    }
    return (
      <div className="App">
        <Scoreboard stats={this.state.stats} level={this.state.level} />
        {this.state.gameOver ? (
          <GameOver reset={() => this.reset()} />
        ) : (
          <div className="container">
            {toolTip}
            <Tiles
              hasFetched={this.state.hasFetched}
              map={this.state.map}
              changeState={(key, newState) => this.changeState(key, newState)}
              loadLevel={this.state.nextLevel}
            />
            <Player
              map={this.state.map}
              stats={this.state.stats}
              changeState={(key, newState) => this.changeState(key, newState)}
              changeEnemyStats={(enemy, stats) =>
                this.changeEnemyStats(enemy, stats)
              }
              removeCell={cell => this.removeCell(cell)}
              x={playerLoc.x}
              y={playerLoc.y}
              nextLevel={() => this.nextLevel()}
              loadLevel={this.state.nextLevel}
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
  stats: {
    health: 100,
    attack: 7,
    weapon: 'Stick',
    nextLevel: 60,
    level: 1
  },
  level: 0,
  gameOver: false
};
