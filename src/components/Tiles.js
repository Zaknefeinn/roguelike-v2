import React, { Component } from 'react';

class Tiles extends Component {
  shouldComponentUpdate() {
    if (this.props.hasFetched) return false;
    else if (this.props.loadLevel) {
      return true;
    } else {
      this.props.changeState('hasFetched', true);
      return true;
    }
  }

  map = () => {
    let screen = [];
    for (let i = 0; i <= 30; i++) {
      for (let j = 0; j <= 25; j++) {
        screen.push({ x: i, y: j });
      }
    }
    return screen;
  };

  render() {
    const map = this.props.map.map(cell => {
      const height = cell.y * 25;
      const width = cell.x * 25;
      return (
        <span
          key={`${cell.x}-${cell.y}`}
          className={`tile ${cell.class}`}
          style={{ top: height, left: width }}
        />
      );
    });

    return <div>{map}</div>;
  }
}

export default Tiles;
