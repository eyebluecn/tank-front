import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import "./List.less";
import TankComponent from "../../common/component/TankComponent";

interface IProps extends RouteComponentProps {}

interface IState {}

export default class List extends TankComponent<IProps, IState>{
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
