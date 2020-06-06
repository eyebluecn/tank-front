import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Edit.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import {Button, Form, Input, Switch} from "antd";
import {SaveOutlined} from '@ant-design/icons';
import TankContentCard from "../widget/TankContentCard";


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Edit extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }


  onFinish(values: any) {
    console.log('Success:', values);

    let that = this

    let user = that.user

  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };


  render() {

    let that = this

    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    return (
      <div className="page-preference-edit">

        <TankTitle name={'网站偏好编辑'}>
        </TankTitle>

        <TankContentCard>
          <Form
            {...layout}
            name="basic"
            initialValues={{remember: true}}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed.bind(this)}
          >

            <Form.Item
              label="网站名称"
              name="name"
              rules={[{required: true, message: '请输入网站名称!'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="logo"
              name="logoUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="favicon"
              name="faviconUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="版权信息"
              name="copyright"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="备案信息"
              name="record"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="office预览地址"
              name="officeUrl"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="zip最大数量限制"
              name="downloadDirMaxNum"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="zip大小限制"
              name="zipMaxSizeLimit"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="默认用户空间大小"
              name="defaultTotalSizeLimit"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="开放注册"
              name="allowRegister"
              valuePropName="checked"
            >
              <Switch/>
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


