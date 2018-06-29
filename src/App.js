import React, { Component } from 'react';
import Tiles from './components/Tiles';
import Player from './components/Player';
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
      portal: {}
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.move);
    document.getElementById('root').focus();
    this.setState({ hasFetched: true });
    this.generateMap();
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.move);
  }

  move = e => {
    let x = this.state.playerLoc.x;
    let y = this.state.playerLoc.y;
    switch (e.keyCode) {
      case 37:
        x -= 1;
        break;
      case 38:
        y -= 1;
        break;
      case 39:
        x += 1;
        break;
      case 40:
        y += 1;
        break;
      default:
        break;
    }
    this.setState({ playerLoc: { x: x, y: y } });
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
    this.setState({ map });
    const floors = map.filter(floor => floor.class === 'floor');
    const randomTiles = this.randomTiles(floors);
    const enemies = randomTiles.slice(1, 7);
    enemies.map(tile => ((tile.class = 'enemy'), (tile.solid = true)));
    const heals = randomTiles.slice(7, 11);
    heals.map(tile => (tile.class = 'heal'));
    const weapons = randomTiles.slice(11, 14);
    weapons.map(tile => (tile.class = 'weapon'));
    this.setState({
      playerLoc: randomTiles[0],
      enemies: enemies,
      heals: heals,
      weapons: weapons,
      portal: randomTiles[15]
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
    const { playerLoc } = this.state;

    return (
      <div className="App">
        <div className="container">
          <Tiles hasFetched={this.state.hasFetched} map={this.state.map} />
          <Player x={playerLoc.x} y={playerLoc.y} />
        </div>
      </div>
    );
  }
}

export default App;
