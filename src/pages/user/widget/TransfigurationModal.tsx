import React from 'react';
import Button from 'antd/lib/button';
import {Modal} from "antd"
import "./TransfigurationModal.less"
import User from "../../../common/model/user/User";
import TankComponent from "../../../common/component/TankComponent";
import BrowserUtil from "../../../common/util/BrowserUtil";
import ClipboardUtil from "../../../common/util/ClipboardUtil";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";

interface IProps {
  user: User
  onClose: () => void
}

interface IState {
}

export default class TransfigurationModal extends TankComponent<IProps, IState> {

  authentication: string = ""

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {

    let that = this

    this.props.user.httpTransfiguration(function (text: string) {

      that.authentication = text
      that.updateUI()

    })

  }

  static open(user: User) {

    let modal = Modal.success({
      okCancel: false,
      okButtonProps: {
        className: "display-none"
      },
      icon: null,
      content: <TransfigurationModal
        user={user}
        onClose={() => {
          modal.destroy()
        }}/>,
    })

  }

  render() {

    let that = this

    let textToCopy = BrowserUtil.fullHost() + "/user/authentication/" + that.authentication

    return (
      <div className="widget-transfiguration-modal">

        <div className="text-center">
          <h2>
            变身提示
          </h2>
        </div>
        <div>
          您将使用该用户的身份登录。请复制以下链接到其他浏览器访问，在当前浏览器访问会导致当前用户登录信息失效。
        </div>
        <div>
          {textToCopy}
        </div>

        <div className="text-center mt20">

          <Button className="ml20" type="default" onClick={() => {
            this.props.onClose()
          }}>关闭</Button>

          <Button className="ml20"
                  type="primary"
                  onClick={() => {

                    ClipboardUtil.copy(textToCopy, function () {
                      MessageBoxUtil.success("复制成功!")
                      that.props.onClose()
                    }, function () {
                      MessageBoxUtil.error("复制失败！")
                    })
                  }}>复制</Button>
        </div>


      </div>
    );
  }
}




