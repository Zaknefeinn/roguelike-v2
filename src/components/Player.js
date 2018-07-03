import React, { Component } from 'react';
import { Combat } from './utilities/Combat';
import { LocateCell } from './utilities/Map';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
  componentDidMount() {
    window.addEventListener('keydown', this.move);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.move);
  }
  componentDidUpdate() {
    if (this.props.stats.health <= 0) {
      this.props.changeState('gameOver', true);
    }
  }
  move = e => {
    const { map } = this.props;
    let x = this.props.x;
    let y = this.props.y;

    const thisCell = map[map.findIndex(cell => cell.x === x && cell.y === y)];
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
      case 32:
        if (thisCell.class === 'portal') {
          this.props.nextLevel();
        }
      default:
        break;
    }
    const nextCell = map[map.findIndex(cell => cell.x === x && cell.y === y)];
    if (nextCell !== undefined) {
      if (!this.props.loadLevel) {
        if (!nextCell.solid) {
          this.props.changeState('playerLoc', { x: x, y: y });
          this.props.changeState('showTooltip', false);
          let stats = { ...this.props.stats };
          switch (nextCell.class) {
            case 'heal':
              const health = stats.health + 10;
              stats.health = health;
              this.props.removeCell(nextCell);
              break;
            case 'weapon':
              const attack = stats.attack + 4;
              stats.attack = attack;
              this.props.removeCell(nextCell);
              break;
            case 'portal':
              this.props.changeState('showTooltip', true);
            default:
              break;
          }
          this.props.changeState('stats', stats);
        }
        //If target is enemy
        if (nextCell.class === 'enemy') {
          const newStats = Combat(this.props.stats, nextCell.stats);
          this.props.changeState('stats', newStats.newPlayerStats);
          if (newStats.newEnemyHp > 0) {
            nextCell.stats.health = newStats.newEnemyHp;
          } else {
            this.props.removeCell(nextCell);
          }
        }
      } else {
        this.props.changeState('nextLevel', false);
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
