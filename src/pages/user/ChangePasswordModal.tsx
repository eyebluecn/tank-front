import React from 'react';
import "./ChangePasswordModal.less"
import BambooComponent from "../../common/component/BambooComponent";
import {Col, Modal, Row} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";

interface IProps {

  onSuccess: () => void
  onClose: () => void
}

interface IState {

}

export default class ChangePasswordModal extends BambooComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  static open(onSuccess: () => void) {

    let modal = Modal.success({
      okCancel: false,
      okButtonProps: {
        className: "display-none"
      },
      icon: null,
      content: <ChangePasswordModal
        onSuccess={() => {

          onSuccess()
          modal.destroy()
        }}
        onClose={() => {
          modal.destroy()
        }}/>,
    })

  }

  componentDidMount() {


  }

  handleSubmit(e: any) {
    e.preventDefault();

    let that = this

    let user = that.user


    user.httpChangePassword("", "", function () {

      that.props.onSuccess()

    })
  };

  render() {

    let that = this

    return (
      <div className="change-password-modal">

        <Row>
          <Col>

            <div className="title">
              修改密码
            </div>

          </Col>
        </Row>

      </div>
    );
  }
}



