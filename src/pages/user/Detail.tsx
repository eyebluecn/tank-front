import React from 'react';
import "./Detail.less"
import TankComponent from "../../common/component/TankComponent";
import {Button, Tag} from 'antd';
import InfoCell from "../widget/InfoCell";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import DateUtil from "../../common/util/DateUtil";
import TankTitle from '../widget/TankTitle';
import TankContentCard from "../widget/TankContentCard";
import {Link, RouteComponentProps} from "react-router-dom";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import {UserRole, UserRoleMap} from "../../common/model/user/UserRole";
import FileUtil from "../../common/util/FileUtil";
import {UserStatusMap} from "../../common/model/user/UserStatus";
import BrowserUtil from "../../common/util/BrowserUtil";
import SingleTextModal from "../widget/SingleTextModal";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import ChangePasswordModal from "./widget/ChangePasswordModal";
import {EditOutlined, UnlockOutlined, UserSwitchOutlined} from '@ant-design/icons';

interface RouteParam {
  uuid: string
}


interface IProps extends RouteComponentProps<RouteParam> {

}

interface IState {

}

export default class Detail extends TankComponent <IProps, IState> {

  //登录的那个用户
  user: User = Moon.getSingleton().user

  //当前页面正在编辑的用户
  currentUser: User = new User(this)

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }


  componentDidMount() {
    let match = this.props.match;
    this.currentUser.uuid = match.params.uuid;
    this.currentUser.httpDetail()
  }

  resetPassword() {
    let that = this

    SingleTextModal.open("请输入新密码", "", function (text: string) {
      that.currentUser.httpResetPassword(text, function (response: any) {
        MessageBoxUtil.success("操作成功!")
      })
    })

  }

  transfiguration() {

  }

  changePassword() {

    let that = this

    let user: User = this.user
    let currentUser: User = this.currentUser
    ChangePasswordModal.open(currentUser, function () {
      MessageBoxUtil.success("修改密码成功!")


    })

  }

  render() {

    let that = this

    let user: User = this.user
    let currentUser: User = this.currentUser

    return (

      <div className="page-user-detail">

        <TankTitle name={'个人资料'}>

          {
            user.role === UserRole.ADMINISTRATOR && (
              <Button className='ml10' type="primary"
                      icon={<UnlockOutlined/>}
                      onClick={this.resetPassword.bind(this)}>
                重置密码
              </Button>
            )
          }

          {
            user.role === UserRole.ADMINISTRATOR && (
              <Button className='ml10' type="primary"
                      icon={<UserSwitchOutlined/>}
                      onClick={this.transfiguration.bind(this)}>
                变身
              </Button>
            )
          }

          {
            currentUser.uuid === user.uuid && (
              <Button className='ml10' type="primary" onClick={this.changePassword.bind(this)} icon={<UnlockOutlined/>}>
                修改密码
              </Button>
            )
          }

          <Link to={'/user/edit/' + currentUser.uuid}>
            <Button className='ml10' type="primary" icon={<EditOutlined/>}>
              编辑
            </Button>
          </Link>
        </TankTitle>

        <TankContentCard loading={currentUser.detailLoading}>

          <div className="text-center mv20">
            <img className="avatar-large" alt="avatar" src={currentUser.getAvatarUrl()} onClick={() => {
              ImagePreviewer.showSinglePhoto(currentUser.getAvatarUrl(true))
            }}/>
            <div className="f24">
              {currentUser.username}
            </div>
          </div>


          <InfoCell name="角色">
            <Tag color={UserRoleMap[currentUser.role].color}>{UserRoleMap[currentUser.role].name}</Tag>
          </InfoCell>


          <InfoCell name="单文件限制">
            {FileUtil.humanFileSize(currentUser.sizeLimit)}
          </InfoCell>


          <InfoCell name="总空间限制">
            {FileUtil.humanFileSize(currentUser.totalSizeLimit)}
          </InfoCell>


          <InfoCell name="已使用空间">
            {FileUtil.humanFileSize(currentUser.totalSize)}
          </InfoCell>


          <InfoCell name="状态">
            <Tag color={UserStatusMap[currentUser.status].color}>{UserStatusMap[currentUser.status].name}</Tag>
          </InfoCell>


          <InfoCell name="上次登录IP">
            {currentUser.lastIp}
          </InfoCell>


          <InfoCell name="上次登录时间">
            {DateUtil.simpleDateTime(currentUser.lastTime)}
          </InfoCell>

          <InfoCell name="WebDAV 地址">
            {BrowserUtil.fullHost() + "/api/dav"}
          </InfoCell>

          {
            currentUser.role === UserRole.ADMINISTRATOR && (
              <InfoCell name="文档链接">
                <a className="f14" href="https://tank-doc.eyeblue.cn" target="_blank">
                  https://tank-doc.eyeblue.cn
                </a>
              </InfoCell>
            )
          }

        </TankContentCard>


      </div>
    )
  }
}

