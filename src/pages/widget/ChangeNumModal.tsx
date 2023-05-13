import React from 'react';
import Button from 'antd/lib/button';
import { Input } from 'antd';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';

interface IProps {
  value: number;
  title?: string;
  onSuccess: (val: number) => void;
  onClose: () => void;
}

interface IState {
  innerValue: number;
}

export default class ChangeNumModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      innerValue: this.props.value,
    };
  }

  componentDidMount() {}

  onSubmitClick() {
    if (this.state.innerValue) {
      this.props.onSuccess(this.state.innerValue);
    } else {
      MessageBoxUtil.error('没有填写值，提交失败！');
    }
  }

  render() {
    let that = this;

    return (
      <div className="widget-change-num-modal">
        <div className="text-center">
          <h2>{that.props.title}</h2>
        </div>

        <Input
          value={this.state.innerValue}
          onChange={(e) => {
            that.setState({
              innerValue: parseInt(e.target.value),
            });
          }}
        />

        <div className="text-center mt20">
          <Button
            className="ml20"
            type="default"
            onClick={() => {
              this.props.onClose();
            }}
          >
            关闭
          </Button>

          <Button
            className="ml20"
            type="primary"
            onClick={() => {
              this.onSubmitClick();
            }}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
