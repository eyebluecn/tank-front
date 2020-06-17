import React, { Component } from "react";
import VelocityReact from "velocity-react";
import SafeUtil from "../../common/util/SafeUtil";

interface IProps {}

interface IState {}

export default class Expanding extends Component<IProps, IState> {
  render() {
    return (
      <VelocityReact.VelocityTransitionGroup
        enter={{ animation: "slideDown" }}
        leave={{ animation: "slideUp" }}
      >
        {this.props.children}
      </VelocityReact.VelocityTransitionGroup>
    );
  }
}
