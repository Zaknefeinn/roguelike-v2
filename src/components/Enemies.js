import React, { Component } from 'react';

export default class Enemies extends Component {
  render() {
    const { enemy } = this.props;
    return <span className={enemy.class} />;
  }
}
