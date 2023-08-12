import React, { useEffect, useRef, useState } from 'react';
import Lang from '../../common/model/global/Lang';
import TankContentCard from '../widget/TankContentCard';
import TankTitle from '../widget/TankTitle';
import Preference from '../../common/model/preference/Preference';
import { Button, Form, Input, Select, Spin, Switch } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import {
  ScanCronType,
  ScanCronTypeList,
  ScanCronTypeValueList,
} from '../../common/model/preference/model/ScanCronType';
import {
  ScanScopeType,
  ScanScopeTypeList,
} from '../../common/model/preference/model/ScanScopeType';
import Space from '../../common/model/space/Space';
import Pager from '../../common/model/base/Pager';
import SortDirection from '../../common/model/base/SortDirection';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Sun from '../../common/model/global/Sun';
import { debounce } from '../../common/util/OptimizeUtil';

const ScanEdit = () => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const pager = useRef(new Pager<Space>(null, Space, Pager.MAX_PAGE_SIZE));
  const preference = useRef(new Preference());
  const [loading, setLoading] = useState(true);
  const [spaceList, setSpaceList] = useState<Space[]>([]);
  const [form] = Form.useForm();

  const handleFinish = async () => {
    const values = await form.validateFields();
    preference.current.scanConfig.assign(values);
    preference.current.httpSaveScan(function () {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
      Sun.updateFrame();
      Sun.navigateTo('/preference/index');
    });
  };

  const handleRefreshSpace = debounce((keyword?: string) => {
    pager.current.setFilterValue('orderCreateTime', SortDirection.DESC);
    pager.current.setFilterValue('name', keyword);
    pager.current.httpList(() => setSpaceList(pager.current.data));
  }, 200);

  useEffect(() => {
    preference.current.detailLoading = true;
    preference.current.httpFetch(() => {
      preference.current.scanConfig.cronType = ScanCronTypeValueList.includes(
        preference.current.scanConfig.cron!
      )
        ? preference.current.scanConfig.cron
        : ScanCronType.CUSTOM;
      setLoading(false);
    });
    handleRefreshSpace();
  }, []);

  return (
    <div className="preference-scan-edit">
      <TankTitle name={Lang.t('preference.editScan')} />
      <TankContentCard loading={loading}>
        <Form
          {...layout}
          form={form}
          initialValues={preference.current.scanConfig}
          onFinish={handleFinish}
        >
          <Form.Item
            label={Lang.t('preference.enableScan')}
            valuePropName="checked"
            name="enable"
            required
          >
            <Switch />
          </Form.Item>

          <Form.Item dependencies={['enable']} noStyle>
            {({ getFieldValue }) => {
              return (
                getFieldValue('enable') && (
                  <>
                    <Form.Item
                      label={Lang.t('preference.scanCron')}
                      name="cronType"
                      required
                      rules={[
                        {
                          required: true,
                          message: Lang.t('preference.scanCronValidate'),
                        },
                      ]}
                    >
                      <Select>
                        {ScanCronTypeList.map((option) => (
                          <Select.Option
                            key={option.value}
                            value={option.value}
                          >
                            {option.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item dependencies={['cronType']} noStyle>
                      {({ getFieldValue }) => {
                        return (
                          getFieldValue('cronType') === ScanCronType.CUSTOM && (
                            <Form.Item
                              label={Lang.t('preference.cron')}
                              name="cron"
                              rules={[
                                {
                                  required: true,
                                  message: Lang.t('preference.cronValidate'),
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          )
                        );
                      }}
                    </Form.Item>

                    <Form.Item
                      label={Lang.t('preference.scanScope')}
                      name="scope"
                      required
                      rules={[
                        {
                          required: true,
                          message: Lang.t('preference.scanScopeValidate'),
                        },
                      ]}
                    >
                      <Select>
                        {ScanScopeTypeList.map((option) => (
                          <Select.Option
                            key={option.value}
                            value={option.value}
                          >
                            {option.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item dependencies={['scope']} noStyle>
                      {({ getFieldValue }) => {
                        return (
                          getFieldValue('scope') === ScanScopeType.CUSTOM && (
                            <Form.Item
                              label={Lang.t('preference.scanSpaces')}
                              name="spaceNames"
                              rules={[
                                {
                                  required: true,
                                  message: Lang.t(
                                    'preference.chooseSpacesValidate'
                                  ),
                                },
                              ]}
                            >
                              <Select
                                mode="multiple"
                                placeholder={Lang.t('preference.chooseSpaces')}
                                className="wp100"
                                filterOption={false}
                                onSearch={handleRefreshSpace}
                              >
                                {spaceList.map((space: Space) => (
                                  <Select.Option
                                    key={space.name}
                                    value={space.name}
                                  >
                                    {space.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          )
                        );
                      }}
                    </Form.Item>
                  </>
                )
              );
            }}
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
};

export default ScanEdit;
