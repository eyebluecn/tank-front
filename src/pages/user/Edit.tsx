import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Edit.less"
import TankComponent from "../../common/component/TankComponent";
import {Button, Form, Input, InputNumber, Select} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import FileUtil from "../../common/util/FileUtil";
import TankContentCard from "../widget/TankContentCard";
import {FormInstance} from "antd/lib/form";
import {SaveOutlined} from "@ant-design/icons/lib";
import {UserRole, UserRoleList} from "../../common/model/user/UserRole";
import ColorSelectionOption from "../../common/model/base/option/ColorSelectionOption";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import Sun from "../../common/model/global/Sun";


interface RouteParam {
  uuid: string
}


interface IProps extends RouteComponentProps<RouteParam> {

}

interface IState {

}

export default class Edit extends TankComponent<IProps, IState> {

  formRef = React.createRef<FormInstance>();

  createMode: boolean = false

  //登录的那个用户
  user: User = Moon.getSingleton().user

  //当前页面正在编辑的用户
  currentUser: User = new User(this)

  constructor(props: IProps) {
    super(props);

    this.state = {};
    this.currentUser.role = UserRole.USER
  }

  componentDidMount() {
    let match = this.props.match;

    if (match.params.uuid) {
      this.createMode = false;
      this.currentUser.uuid = match.params.uuid;
      this.currentUser.httpDetail();
    } else {
      this.createMode = true;
      this.updateUI()
    }

  }

  onFinish(values: any) {
    console.log('Success:', values);

    let that = this

    let user: User = this.user
    let currentUser: User = this.currentUser

    currentUser.assign(values)

    currentUser.httpSave(function () {
      MessageBoxUtil.success(that.createMode ? '创建成功！' : '保存成功！')

      //如果是自己的资料修改成功，更新一下本地。
      if (user.uuid === currentUser.uuid) {
        user.assign(currentUser)
      }

      Sun.navigateBack()
    })

  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };


  render() {

    let that = this

    let user: User = this.user
    let currentUser: User = this.currentUser

    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };

    //当前是否为编辑自己的模式。
    let editSelf: boolean = false
    if (!this.createMode && user.uuid === currentUser.uuid) {
      editSelf = true
    }

    //是否可以编辑角色。
    let roleEditable: boolean = false
    if (this.createMode || (user.uuid !== currentUser.uuid && user.role === UserRole.ADMINISTRATOR)) {
      roleEditable = true
    }

    return (

      <div className="page-user-edit">

        <TankTitle name={this.createMode ? '创建用户' : '编辑用户'}>

        </TankTitle>

        <TankContentCard loading={currentUser.detailLoading}>

          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed.bind(this)}
            onValuesChange={() => {
              that.updateUI()
            }}
          >
            {editSelf && (
              <Form.Item
                label="头像"
                name="avatarUrl"
                initialValue={currentUser.avatarUrl}
              >
                <Input/>
              </Form.Item>
            )}

            <Form.Item
              label="用户名"
              name="username"
              initialValue={currentUser.username}
              rules={[{required: true, message: '用户名必填!'}]}
            >
              <Input disabled={!this.createMode}/>
            </Form.Item>

            {
              this.createMode && (
                <Form.Item
                  label="密码"
                  name="password"
                  rules={[{required: true, message: '密码必填!'}]}
                >
                  <Input.Password/>
                </Form.Item>
              )
            }

            {
              this.createMode && (
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: '请确认密码!',
                    },
                    ({getFieldValue}) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('两次输入密码不匹配!');
                      },
                    }),
                  ]}
                >
                  <Input.Password/>
                </Form.Item>
              )
            }
            <Form.Item
              label="角色"
              name="role"
              initialValue={currentUser.role}
            >
              <Select disabled={!roleEditable}>
                {
                  UserRoleList.filter((item: ColorSelectionOption, index: number) => {
                    return item.value !== UserRole.GUEST
                  }).map((item: ColorSelectionOption, index: number) => {
                    return <Select.Option key={index} value={item.value}>{item.name}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item
              label="单文件限制"
              required={true}
            >
              <Form.Item
                name="sizeLimit"
                rules={[{required: true, message: '单文件限制必填!'}]}
                initialValue={currentUser.sizeLimit}
                noStyle
              >
                <InputNumber min={-1} className='w150'/>
              </Form.Item>
              <span
                className="pl10"> 当前值：
                {(this.formRef && this.formRef.current) ?
                  FileUtil.humanFileSize(this.formRef.current.getFieldValue("sizeLimit"))
                  : FileUtil.humanFileSize(currentUser.sizeLimit)}
              </span>
            </Form.Item>

            <Form.Item
              label="空间大小限制"
              required={true}
            >
              <Form.Item
                name="totalSizeLimit"
                rules={[{required: true, message: '空间大小限制必填!'}]}
                initialValue={currentUser.totalSizeLimit}
                noStyle
              >
                <InputNumber min={-1} className='w150'/>
              </Form.Item>
              <span
                className="pl10"> 当前值：
                {(this.formRef && this.formRef.current) ?
                  FileUtil.humanFileSize(this.formRef.current.getFieldValue("totalSizeLimit"))
                  : FileUtil.humanFileSize(currentUser.totalSizeLimit)}
              </span>
            </Form.Item>

            <div className="text-right">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined/>}>
                {this.createMode ? '创建' : '保存'}
              </Button>
            </div>

          </Form>
        </TankContentCard>


      </div>
    );
  }
}


