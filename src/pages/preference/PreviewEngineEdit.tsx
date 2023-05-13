import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './PreviewEngineEdit.less';
import TankComponent from '../../common/component/TankComponent';
import Preference from '../../common/model/preference/Preference';
import Moon from '../../common/model/global/Moon';
import Lang from '../../common/model/global/Lang';
import TankTitle from '../widget/TankTitle';
import TankContentCard from '../widget/TankContentCard';
import { Button, Form, Tooltip } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SaveOutlined } from '@ant-design/icons';
import PreviewConfigPanel from './widget/PreviewConfigPanel';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Sun from '../../common/model/global/Sun';
import { QuestionCircleOutlined } from '@ant-design/icons/lib';

interface IProps extends RouteComponentProps {}

interface IState {}

export default class PreviewEngineEdit extends TankComponent<IProps, IState> {
  formRef = React.createRef<FormInstance>();
  preference: Preference = Moon.getSingleton().preference;

  constructor(props: IProps) {
    super(props);
    this.preference.detailLoading = true;
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    this.preference.httpFetch(() => {
      this.preference.detailLoading = false;
      this.updateUI();
    });
  }

  finish(values: any) {
    this.preference.assign(values);
    this.preference.httpSavePreviewEngine(function () {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
      Sun.updateFrame();
      Sun.navigateTo('/preference/index');
    });
  }

  render() {
    const { preference } = this;
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className="preference-preview-engine-edit">
        <TankTitle name={Lang.t('preference.editPreviewEngine')} />
        <TankContentCard loading={preference.detailLoading}>
          <Form
            {...layout}
            name="preview-engine"
            ref={this.formRef}
            onFinish={(e) => this.finish(e)}
            onValuesChange={this.updateUI}
          >
            <Form.Item
              label={
                <Tooltip title={Lang.t('preference.engineUsageHint')}>
                  <div>
                    {Lang.t('preference.previewConfig')}
                    <QuestionCircleOutlined className="btn-action text-warning" />
                  </div>
                </Tooltip>
              }
            >
              <PreviewConfigPanel previewConfig={preference.previewConfig} />
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
