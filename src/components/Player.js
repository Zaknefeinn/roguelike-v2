import React, { Component } from 'react';
import { Combat } from './utilities/Combat';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {
        health: 100,
        attack: 7,
        weapon: 'Stick',
        nextLevel: 60,
        level: 1
      }
    };
  }

  componentDidMount() {
    this.props.changeState('stats', this.state.stats);
    window.addEventListener('keydown', this.move);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.move);
  }
  componentDidUpdate() {
    if (this.state.stats.health <= 0) {
      this.props.changeState('gameOver', true);
    }
  }
  move = e => {
    const { map } = this.props;
    let x = this.props.x;
    let y = this.props.y;
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
    const nextCell = map.findIndex(cell => cell.x === x && cell.y === y);
    if (map[nextCell] !== undefined) {
      if (!map[nextCell].solid) {
        this.props.changeState('playerLoc', { x: x, y: y });
        switch (map[nextCell].class) {
          case 'heal':
            const health = this.state.stats.health + 10;
            // this.setState(prevState => ({
            //   ...prevState.stats,
            //   health
            // }));
            break;
          case 'weapon':
            console.log('weapon');
            break;
          default:
            break;
        }
      }
      //If target is enemy
      if (map[nextCell].class === 'enemy') {
        const newStats = Combat(this.state.stats, map[nextCell].stats);
        this.setState({
          stats: newStats.newPlayerStats
        });
        this.props.changeState('stats', newStats.newPlayerStats);
        this.props.changeEnemyStats(map[nextCell], newStats.newEnemyHp);
      }
    }
  };

  render() {
    const height = this.props.y * 25;
    const width = this.props.x * 25;
    return (
      <div>
        <span className="tile player" style={{ top: height, left: width }} />
      </div>
    );
  }
}

export default Player;
