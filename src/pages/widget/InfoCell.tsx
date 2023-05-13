import React from 'react';
import './InfoCell.less';
import { Col, Row } from 'antd';

interface IProps {
  name: string;
  firstSpan?: number;
}

interface IState {}

export default class InfoCell extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let that = this;
    let name: string = this.props.name;

    let firstSpan: number = 8;
    if (this.props.firstSpan !== undefined) {
      firstSpan = this.props.firstSpan;
    }
    let secondSpan: number = 24 - firstSpan;

    return (
      <Row className="castle-widget-info-cell">
        <Col span={firstSpan} className="info-cell-name">
          {name}
        </Col>
        <Col span={secondSpan} className="info-cell-content">
          {that.props.children}
        </Col>
      </Row>
    );
  }
}
