import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Edit.less';
import TankComponent from '../../common/component/TankComponent';
import User from '../../common/model/user/User';
import Moon from '../../common/model/global/Moon';
import TankTitle from '../widget/TankTitle';
import { Button, Form, Input, InputNumber, Switch } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import TankContentCard from '../widget/TankContentCard';
import Preference from '../../common/model/preference/Preference';
import { FormInstance } from 'antd/lib/form';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Sun from '../../common/model/global/Sun';
import Lang from '../../common/model/global/Lang';
import MatterImage from '../matter/widget/MatterImage';
import InputSize from '../widget/form/InputSize';

interface IProps extends RouteComponentProps {}

interface IState {}

export default class Edit extends TankComponent<IProps, IState> {
  formRef = React.createRef<FormInstance>();

  user: User = Moon.getSingleton().user;
  preference: Preference = Moon.getSingleton().preference;

  constructor(props: IProps) {
    super(props);

    this.state = {};

    this.preference.detailLoading = true;
  }

  componentDidMount() {
    let that = this;

    that.refreshPreference();
  }

  refreshPreference() {
    let that = this;

    that.preference.httpFetch(function () {
      that.preference.detailLoading = false;
      that.updateUI();
    });
  }

  onFinish(values: any) {
    let that = this;

    let user = that.user;

    that.preference.assign(values);

    that.preference.httpSave(function () {
      MessageBoxUtil.success(Lang.t('operationSuccess'));

      Sun.updateFrame();

      Sun.navigateTo('/preference/index');
    });
  }

  onFinishFailed(errorInfo: any) {}

  render() {
    let that = this;

    let preference = that.preference;

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    let initialValues: any = preference.getForm();

    return (
      <div className="page-preference-edit">
        <TankTitle name={Lang.t('preference.editPreference')} />

        <TankContentCard loading={preference.detailLoading}>
          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            initialValues={initialValues}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed.bind(this)}
            onValuesChange={() => that.updateUI()}
          >
            <Form.Item
              label={Lang.t('preference.websiteName')}
              name="name"
              rules={[
                {
                  required: true,
                  message: Lang.t('preference.enterWebsiteName'),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="logo" name="logoUrl">
              <MatterImage uploadHint={Lang.t('preference.logoSquare')} />
            </Form.Item>

            <Form.Item label="favicon" name="faviconUrl">
              <MatterImage
                filter=".ico"
                previewWidth={60}
                uploadHint={Lang.t('preference.onlyAllowIco')}
              />
            </Form.Item>

            <Form.Item label={Lang.t('preference.copyright')} name="copyright">
              <Input />
            </Form.Item>

            <Form.Item label={Lang.t('preference.extraInfo')} name="record">
              <Input />
            </Form.Item>

            <Form.Item
              label={Lang.t('preference.zipMaxNumLimit')}
              name="downloadDirMaxNum"
              rules={[
                {
                  required: true,
                  message: Lang.t('preference.enterZipMaxNumLimit'),
                },
              ]}
            >
              <InputNumber min={-1} max={1000} className="w150" />
            </Form.Item>

            <Form.Item
              label={Lang.t('preference.zipMaxSizeLimit')}
              required={true}
              name="downloadDirMaxSize"
              rules={[
                {
                  required: true,
                  message: Lang.t('preference.enterZipMaxSizeLimit'),
                },
              ]}
            >
              <InputSize className="w200" />
            </Form.Item>

            <Form.Item
              label={Lang.t('preference.userDefaultSizeLimit')}
              required={true}
              name="defaultTotalSizeLimit"
              rules={[
                {
                  required: true,
                  message: Lang.t('preference.enterUserDefaultSizeLimit'),
                },
              ]}
            >
              <InputSize className="w200" />
            </Form.Item>

            <Form.Item
              label={Lang.t('preference.matterBinDefaultSaveDay')}
              required={true}
            >
              <Form.Item
                name="deletedKeepDays"
                rules={[
                  {
                    required: true,
                    message: Lang.t('preference.enterMatterBinDefaultSaveDay'),
                  },
                ]}
                noStyle
              >
                <InputNumber min={0} className="w150" />
              </Form.Item>
              <span className="pl10">
                {Lang.t('preference.matterBinDefaultTip')}
              </span>
            </Form.Item>

            <Form.Item
              label={Lang.t('preference.allowRegister')}
              name="allowRegister"
              required={true}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <div className="text-right">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {Lang.t('save')}
              </Button>
            </div>
          </Form>
        </TankContentCard>
      </div>
    );
  }
}
