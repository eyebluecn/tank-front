import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Edit.less"
import TankComponent from "../../common/component/TankComponent";
import {Button, Col, Form, Input, InputNumber, message as MessageBox, Row} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import FileUtil from "../../common/util/FileUtil";
import TankContentCard from "../widget/TankContentCard";
import {FormInstance} from "antd/lib/form";
import {SaveOutlined} from "@ant-design/icons/lib";


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
  }

  componentDidMount() {
    let match = this.props.match;

    if (match.params.uuid) {
      this.createMode = false;

      this.currentUser.uuid = match.params.uuid;

      this.currentUser.httpDetail();

    } else {
      this.createMode = true;
    }

  }

  onFinish(values: any) {
    console.log('Success:', values);

    let that = this

    let user = that.user

    user.httpLogin(values["username"], values["password"], function () {
      MessageBox.success("登录成功！")

      that.props.history.push('/')

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

    const complexLayout = {
      labelCol: {span: 12},
      wrapperCol: {span: 12},
    };

    let initialValues: any = currentUser.getForm()

    return (

      <div className="page-user-edit">

        <TankTitle name={this.createMode ? '创建用户' : '编辑用户'}>

        </TankTitle>

        <TankContentCard loading={currentUser.detailLoading}>

          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            initialValues={initialValues}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed.bind(this)}
            onValuesChange={() => {
              that.updateUI()
            }}
          >
            <Form.Item
              label="头像"
              name="avatarUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="用户名"
              name="username"
            >
              <Input/>
            </Form.Item>


            <Form.Item
              label="密码"
              name="password"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="角色"
              name="role"
            >
              <Input/>
            </Form.Item>

            <Form.Item label="单文件限制"
            >
              <Form.Item
                name="singleFileSizeLimit"
                noStyle
              >
                <InputNumber min={-1} className='w150'/>
              </Form.Item>
              <span
                className="pl10"> 当前值：
                {(this.formRef && this.formRef.current) ?
                  FileUtil.humanFileSize(this.formRef.current.getFieldValue("singleFileSizeLimit"))
                  : FileUtil.humanFileSize(initialValues.singleFileSizeLimit)}
              </span>
            </Form.Item>

            <Form.Item label="空间大小限制"
            >
              <Form.Item
                name="totalSizeLimit"
                noStyle
              >
                <InputNumber min={-1} className='w150'/>
              </Form.Item>
              <span
                className="pl10"> 当前值：
                {(this.formRef && this.formRef.current) ?
                  FileUtil.humanFileSize(this.formRef.current.getFieldValue("totalSizeLimit"))
                  : FileUtil.humanFileSize(initialValues.totalSizeLimit)}
              </span>
            </Form.Item>

            <div className="text-right">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined/>}>
                保存
              </Button>
            </div>

          </Form>
        </TankContentCard>


      </div>
    );
  }
}


