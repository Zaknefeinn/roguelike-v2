import React, { Component } from 'react';
import Tiles from './components/Tiles';
import Player from './components/Player';
import Scoreboard from './components/Scoreboard';
import ROT from 'rot-js';
import './App.css';

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
      stats: {}
    };
  }

  componentDidMount() {
    document.getElementById('root').focus();
    this.setState({ hasFetched: true });
    this.generateMap();
  }
  getHeroStats = stats => {
    this.setState({ stats });
  };
  movePlayer = nextLoc => {
    this.setState({ playerLoc: nextLoc.playerLoc });
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
        (tile.class = 'enemy'), (tile.solid = true), (tile.stats = 'test')
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
        <Scoreboard stats={this.state.stats} />
        <div className="container">
          <Tiles hasFetched={this.state.hasFetched} map={this.state.map} />
          <Player
            map={this.state.map}
            move={next => this.movePlayer(next)}
            getStats={stats => this.getHeroStats(stats)}
            x={playerLoc.x}
            y={playerLoc.y}
          />
        </div>
      </div>
    );
  }
}

export default App;
