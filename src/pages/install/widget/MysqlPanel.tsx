import React from 'react';
import './MysqlPanel.less';
import {Alert, Button, Form, Input, Select} from 'antd';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";
import {FormInstance} from "antd/lib/form";
import {ArrowRightOutlined, DisconnectOutlined, LinkOutlined, SoundOutlined} from "@ant-design/icons/lib";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";
import Lang from "../../../common/model/global/Lang";

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
      MessageBoxUtil.success(Lang.t("install.mysqlConnectionPass"))
      that.updateUI()

    }, function (msg: any) {

      install.verified = false
      MessageBoxUtil.error(msg)
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
      MessageBoxUtil.error(Lang.t("install.validateMysqlFirst"))

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
            rules={[{required: true, message: Lang.t("inputRequired")}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label={Lang.t("install.port")}
            name="mysqlPort"
            initialValue={install.mysqlPort}
            rules={[{required: true, message: Lang.t("inputRequired")}]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label={Lang.t("install.schema")}
            name="mysqlSchema"
            initialValue={install.mysqlSchema}
            rules={[{required: true, message: Lang.t("inputRequired")}]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label={Lang.t("install.username")}
            name="mysqlUsername"
            initialValue={install.mysqlUsername}
            rules={[{required: true, message: Lang.t("inputRequired")}]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label={Lang.t("install.password")}
            name="mysqlPassword"
            initialValue={install.mysqlPassword}
            rules={[{required: true, message: Lang.t("inputRequired")}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item
            label={Lang.t("install.charset")}
            name="mysqlCharset"
            initialValue={install.mysqlCharset}
            rules={[{required: true, message: Lang.t("inputRequired")}]}
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
                <div><SoundOutlined/> {Lang.t("install.notice")}</div>
                <div>
                  <ol>
                    <li> {Lang.t("install.mysqlNotice1")}</li>
                    <li>{Lang.t("install.mysqlNotice2")}</li>
                  </ol>
                </div>
              </div>}
              type="info"
            />
          </div>

          <div className="text-right mt15">
            <Button type={install.verified ? "primary" : "default"} htmlType="submit"
                    icon={install.verified ? <LinkOutlined/> : <DisconnectOutlined/>}>
              {install.verified ? Lang.t("install.mysqlConnectionPass") : Lang.t("install.testMysqlConnection")}
            </Button>
            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowRightOutlined/>}
                    onClick={this.goToNext.bind(this)}>
              {Lang.t("install.nextStep")}
            </Button>
          </div>

        </Form>

      </div>
    );
  }
}


