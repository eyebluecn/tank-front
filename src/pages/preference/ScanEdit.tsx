import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./ScanEdit.less";
import TankComponent from "../../common/component/TankComponent";
import Preference from "../../common/model/preference/Preference";
import Moon from "../../common/model/global/Moon";
import Lang from "../../common/model/global/Lang";
import TankTitle from "../widget/TankTitle";
import TankContentCard from "../widget/TankContentCard";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import { FormInstance } from "antd/lib/form";
import { SaveOutlined } from "@ant-design/icons";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import Sun from "../../common/model/global/Sun";
import {
  ScanScopeType,
  ScanScopeTypeList,
} from "../../common/model/preference/model/ScanScopeType";
import {
  ScanCronType,
  ScanCronTypeList,
  ScanCronTypeValueList,
} from "../../common/model/preference/model/ScanCronType";
import Pager from "../../common/model/base/Pager";
import User from "../../common/model/user/User";
import SortDirection from "../../common/model/base/SortDirection";

interface IProps extends RouteComponentProps {}

interface IState {}

export default class ScanEdit extends TankComponent<IProps, IState> {
  formRef = React.createRef<FormInstance>();

  preference: Preference = Moon.getSingleton().preference;
  pager: Pager<User> = new Pager<User>(this, User, 10);

  constructor(props: IProps) {
    super(props);
    this.preference.detailLoading = true;
  }

  componentDidMount() {
    this.preference.httpFetch(() => {
      this.preference.detailLoading = false;

      // 给前端辅助字段赋值
      this.preference.scanConfig.cronType = this.preference.scanConfig.cron;
      if (
        !ScanCronTypeValueList.includes(this.preference.scanConfig.cronType!)
      ) {
        this.preference.scanConfig.cronType = ScanCronType.CUSTOM;
      }

      if (this.preference.scanConfig.scope !== ScanScopeType.ALL) {
        this.preference.scanConfig.users = this.preference.scanConfig.usernames.map(
          (name: string) => ({
            label: name,
            value: name,
          })
        );
      }

      this.updateUI();
    });
  }

  finish = (values: any) => {
    if (values.scope === ScanScopeType.CUSTOM) {
      this.preference.scanConfig.assign({
        ...values,
        usernames: values.users.map((item: any) => item.value),
      });
    } else {
      this.preference.scanConfig.assign(values);
    }

    this.preference.httpSaveScan(function () {
      MessageBoxUtil.success(Lang.t("operationSuccess"));
      Sun.updateFrame();
      Sun.navigateTo("/preference/index");
    });
  };

  changeEnableScan = (value: boolean) => {
    this.preference.scanConfig.enable = value;
    this.updateUI();
  };

  changeCronType = (value: ScanCronType) => {
    this.preference.scanConfig.cronType = value;
    this.updateUI();
  };

  changeScopeType = (value: ScanScopeType) => {
    this.preference.scanConfig.scope = value;
    this.updateUI();
  };

  fetchUser = (value: any) => {
    this.pager.resetFilter();
    this.pager.setFilterValue("orderCreateTime", SortDirection.DESC);
    this.pager.setFilterValue("username", value);
    this.pager.httpList();
  };

  render() {
    const { preference, pager } = this;

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className="preference-scan-edit">
        <TankTitle name={Lang.t("preference.editScan")} />
        <TankContentCard loading={preference.detailLoading}>
          <Form
            {...layout}
            name="preview-engine"
            ref={this.formRef}
            initialValues={preference.scanConfig}
            onFinish={this.finish}
            onValuesChange={() => this.updateUI}
          >
            <Form.Item
              label={Lang.t("preference.enableScan")}
              valuePropName="checked"
              name="enable"
            >
              <Switch onChange={this.changeEnableScan} />
            </Form.Item>
            {preference.scanConfig.enable && (
              <>
                <Form.Item
                  label={Lang.t("preference.scanCron")}
                  name="cronType"
                >
                  <Select onChange={this.changeCronType}>
                    {ScanCronTypeList.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {preference.scanConfig.cronType === ScanCronType.CUSTOM && (
                  <Form.Item
                    label={Lang.t("preference.cron")}
                    name="cron"
                    rules={[
                      {
                        required: true,
                        message: Lang.t("preference.cronValidate"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )}
                <Form.Item label={Lang.t("preference.scanScope")} name="scope">
                  <Select onChange={this.changeScopeType}>
                    {ScanScopeTypeList.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {preference.scanConfig.scope === ScanScopeType.CUSTOM && (
                  <Form.Item
                    label={Lang.t("preference.scanUsers")}
                    name="users"
                    rules={[
                      {
                        required: true,
                        message: Lang.t("preference.chooseUsersValidate"),
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder={Lang.t("preference.chooseUsers")}
                      notFoundContent={
                        pager.loading ? <Spin size="small" /> : null
                      }
                      filterOption={false}
                      onSearch={this.fetchUser}
                      style={{ width: "100%" }}
                    >
                      {pager.data.map((user: User) => (
                        <Select.Option
                          key={user.username!}
                          value={user.username!}
                        >
                          {user.username}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </>
            )}
            <div className="text-right">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {Lang.t("save")}
              </Button>
            </div>
          </Form>
        </TankContentCard>
      </div>
    );
  }
}
