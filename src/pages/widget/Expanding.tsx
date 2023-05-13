import React, { Component } from 'react';
import VelocityReact from 'velocity-react';

interface IProps {}

interface IState {}

export default class Expanding extends Component<IProps, IState> {
  render() {
    return (
      <VelocityReact.VelocityTransitionGroup
        enter={{ animation: 'slideDown' }}
        leave={{ animation: 'slideUp' }}
      >
        {this.props.children}
      </VelocityReact.VelocityTransitionGroup>
    );
  }
}
