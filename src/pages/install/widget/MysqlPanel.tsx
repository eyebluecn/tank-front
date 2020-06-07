import React from 'react';
import './MysqlPanel.less';
import {Alert, Button, Form, Input, Select, Tabs} from 'antd';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";
import {FormInstance} from "antd/lib/form";
import {ArrowRightOutlined, DisconnectOutlined, LinkOutlined, SoundOutlined} from "@ant-design/icons/lib";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";

const {TabPane} = Tabs;

interface IProps {
  install: Install
  onNextStep: () => void
}

interface IState {

}

export default class MysqlPanel extends TankComponent<IProps, IState> {
  formRef = React.createRef<FormInstance>();

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let that = this;

    that.updateUI();
  }


  onFinish(values: any) {
    console.log('Success:', values);

    let that = this
    let install: Install = this.props.install

    install.mysqlHost = values["mysqlHost"]
    install.mysqlPort = values["mysqlPort"]
    install.mysqlSchema = values["mysqlSchema"]
    install.mysqlUsername = values["mysqlUsername"]
    install.mysqlPassword = values["mysqlPassword"]
    install.mysqlCharset = values["mysqlCharset"]

    install.httpVerify(function () {

      install.verified = true
      MessageBoxUtil.success("MySQL连接测试通过！")
      that.updateUI()

    }, function (msg: any) {

      install.verified = false
      MessageBoxUtil.success(msg)
      that.updateUI()

    })
  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };

  goToNext() {
    let that = this
    let install: Install = this.props.install

    if (install.verified) {

      this.props.onNextStep()

    } else {
      MessageBoxUtil.error("请首先验证数据库连接")

    }

  }


  render() {

    let that = this;

    let install: Install = this.props.install

    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };

    return (
      <div className="widget-mysql-panel">

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
          <Form.Item
            label="MySQL host"
            name="mysqlHost"
            initialValue={install.mysqlHost}
            rules={[{required: true, message: '请输入MySQL host!'}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="MySQL 端口"
            name="mysqlPort"
            initialValue={install.mysqlPort}
            rules={[{required: true, message: '请输入MySQL 端口!'}]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label="MySQL 库名"
            name="mysqlSchema"
            initialValue={install.mysqlSchema}
            rules={[{required: true, message: '请输入MySQL 库名!'}]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label="MySQL 用户名"
            name="mysqlUsername"
            initialValue={install.mysqlUsername}
            rules={[{required: true, message: '请输入MySQL 用户名!'}]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label="MySQL 密码"
            name="mysqlPassword"
            initialValue={install.mysqlPassword}
            rules={[{required: true, message: '请输入MySQL 密码!'}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item
            label="MySQL 编码"
            name="mysqlCharset"
            initialValue={install.mysqlCharset}
            rules={[{required: true, message: '请输入MySQL 编码!'}]}
          >
            <Select>
              <Select.Option value="utf8">utf8</Select.Option>
              <Select.Option value="utf8mb4">utf8mb4</Select.Option>
              <Select.Option value="gbk">gbk</Select.Option>
            </Select>
          </Form.Item>

          <div>
            <Alert
              message={<div>
                <div><SoundOutlined/> 提示：</div>
                <div>
                  <ol>
                    <li>如果数据库和蓝眼云盘安装在同一台服务器，Host可以直接填写 127.0.0.1。</li>
                    <li>数据库账户的权限要求要能够创建表，否则第二步"创建表"操作会出错。</li>
                  </ol>
                </div>
              </div>}
              type="info"
            />
          </div>

          <div className="text-right mt15">
            <Button type={install.verified ? "primary" : "default"} htmlType="submit"
                    icon={install.verified ? <LinkOutlined/> : <DisconnectOutlined/>}>
              {install.verified ? 'MySQL测试通过' : '测试MySQL连接性'}
            </Button>
            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowRightOutlined/>}
                    onClick={this.goToNext.bind(this)}>
              下一步
            </Button>
          </div>

        </Form>

      </div>
    );
  }
}


