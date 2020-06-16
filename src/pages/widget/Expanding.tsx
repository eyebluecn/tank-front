import React, { Component } from "react";
import { Transition } from "react-transition-group";
import Velocity from "velocity-animate";
import SafeUtil from "../../common/util/SafeUtil";

interface IProps {
  inStatus: boolean;
  onExited?: () => any
}

interface IState {}

export default class Expanding extends Component<IProps, IState> {
  onEnter = (el: HTMLElement) => {
    Velocity(el, "slideDown");
  };

  onExit = (el: HTMLElement) => {
    Velocity(el, "slideUp");
  };

  onExited = () => {
    SafeUtil.safeCallback(this.props.onExited)();
  };

  render() {
    return (
      <Transition
        in={this.props.inStatus}
        timeout={377}
        onEnter={this.onEnter}
        onExit={this.onExit}
        onExited={this.onExited}
      >
        <>
          {this.props.children}
        </>
      </Transition>
    );
  }
}
