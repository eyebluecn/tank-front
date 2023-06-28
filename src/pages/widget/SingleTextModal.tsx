import React from 'react';
import Button from 'antd/lib/button';
import { Input, Modal } from 'antd';
import TankComponent from '../../common/component/TankComponent';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';

interface IProps {
  value: string;
  title?: string;
  onSuccess: (val: string) => void;
  onClose: () => void;
}

interface IState {
  innerValue: string;
}

export default class SingleTextModal extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      innerValue: this.props.value,
    };
  }

  componentDidMount() {}

  static open(
    title: string,
    initialValue: string,
    onSuccess: (text: string) => void
  ) {
    let modal = Modal.success({
      className: 'custom-handle-modal',
      okCancel: false,
      icon: null,
      content: (
        <SingleTextModal
          title={title}
          value={initialValue}
          onSuccess={(val: string) => {
            modal.destroy();

            onSuccess(val);
          }}
          onClose={() => {
            modal.destroy();
          }}
        />
      ),
    });
  }

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
      <div className="widget-single-text-modal">
        <div className="text-center">
          <h2>{that.props.title}</h2>
        </div>

        <Input
          value={this.state.innerValue}
          onChange={(e) => {
            that.setState({
              innerValue: e.target.value,
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
