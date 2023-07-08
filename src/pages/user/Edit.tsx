import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Edit.less';
import TankComponent from '../../common/component/TankComponent';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import User from '../../common/model/user/User';
import Moon from '../../common/model/global/Moon';
import TankTitle from '../widget/TankTitle';
import FileUtil from '../../common/util/FileUtil';
import TankContentCard from '../widget/TankContentCard';
import { FormInstance } from 'antd/lib/form';
import { SaveOutlined } from '@ant-design/icons/lib';
import { UserRole, UserRoleList } from '../../common/model/user/UserRole';
import ColorSelectionOption from '../../common/model/base/option/ColorSelectionOption';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Sun from '../../common/model/global/Sun';
import Lang from '../../common/model/global/Lang';
import MatterImage from '../matter/widget/MatterImage';
import InputSize from '../widget/form/InputSize';

interface RouteParam {
  uuid: string;
}

interface IProps extends RouteComponentProps<RouteParam> {}

interface IState {}

export default class Edit extends TankComponent<IProps, IState> {
  formRef = React.createRef<FormInstance>();

  createMode: boolean = false;

  //登录的那个用户
  user: User = Moon.getSingleton().user;

  //当前页面正在编辑的用户
  currentUser: User = new User(this);

  constructor(props: IProps) {
    super(props);

    this.state = {};
    this.currentUser.role = UserRole.USER;
  }

  componentDidMount() {
    let match = this.props.match;

    if (match.params.uuid) {
      this.createMode = false;
      this.currentUser.uuid = match.params.uuid;
      this.currentUser.httpDetail();
    } else {
      this.createMode = true;
      this.updateUI();
    }
  }

  onFinish(values: any) {
    let that = this;

    let user: User = this.user;
    let currentUser: User = this.currentUser;

    currentUser.assign(values);

    currentUser.httpSave(
      {
        sizeLimit: values.sizeLimit,
        totalSizeLimit: values.totalSizeLimit,
      },
      function () {
        MessageBoxUtil.success(Lang.t('operationSuccess'));

        //如果是自己的资料修改成功，更新一下本地。
        if (user.uuid === currentUser.uuid) {
          user.assign(currentUser);
        }

        Sun.navigateBack();
      }
    );
  }

  render() {
    let that = this;

    let user: User = this.user;
    let currentUser: User = this.currentUser;

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    //当前是否为编辑自己的模式。
    let editSelf: boolean = false;
    if (!this.createMode && user.uuid === currentUser.uuid) {
      editSelf = true;
    }

    //是否可以编辑角色。
    let roleEditable: boolean = false;
    if (
      this.createMode ||
      (user.uuid !== currentUser.uuid && user.role === UserRole.ADMINISTRATOR)
    ) {
      roleEditable = true;
    }

    return (
      <div className="page-user-edit">
        <TankTitle
          name={
            this.createMode
              ? Lang.t('user.createUser')
              : Lang.t('user.editUser')
          }
        ></TankTitle>

        <TankContentCard loading={currentUser.detailLoading}>
          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            onFinish={this.onFinish.bind(this)}
            onValuesChange={() => {
              that.updateUI();
            }}
          >
            {editSelf && (
              <Form.Item
                label={Lang.t('user.avatar')}
                name="avatarUrl"
                initialValue={currentUser.avatarUrl}
              >
                <MatterImage />
              </Form.Item>
            )}

            <Form.Item
              label={Lang.t('user.username')}
              name="username"
              initialValue={currentUser.username}
              rules={[
                { required: true, message: Lang.t('user.enterUsername') },
              ]}
            >
              <Input disabled={!this.createMode} />
            </Form.Item>

            {this.createMode && (
              <Form.Item
                label={Lang.t('user.password')}
                name="password"
                rules={[
                  { required: true, message: Lang.t('user.enterPassword') },
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

            {this.createMode && (
              <Form.Item
                name="confirmPassword"
                label={Lang.t('user.confirmPassword')}
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: Lang.t('user.enterPassword'),
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(Lang.t('user.passwordNotSame'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}
            <Form.Item
              label={Lang.t('user.role')}
              name="role"
              initialValue={currentUser.role}
            >
              <Select disabled={!roleEditable}>
                {UserRoleList.filter(
                  (item: ColorSelectionOption, index: number) => {
                    return item.value !== UserRole.GUEST;
                  }
                ).map((item: ColorSelectionOption, index: number) => {
                  return (
                    <Select.Option key={index} value={item.value}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              label={Lang.t('user.singleFileSizeLimit')}
              required
              name="sizeLimit"
              rules={[{ required: true, message: Lang.t('inputRequired') }]}
              initialValue={currentUser.space?.sizeLimit}
            >
              <InputSize
                className="w200"
                disabled={user.role !== UserRole.ADMINISTRATOR}
              />
            </Form.Item>

            <Form.Item
              label={Lang.t('user.totalFileSizeLimit')}
              required
              name="totalSizeLimit"
              rules={[{ required: true, message: Lang.t('inputRequired') }]}
              initialValue={currentUser.space?.totalSizeLimit}
            >
              <InputSize
                className="w200"
                disabled={user.role !== UserRole.ADMINISTRATOR}
              />
            </Form.Item>

            <div className="text-right">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {this.createMode ? Lang.t('create') : Lang.t('save')}
              </Button>
            </div>
          </Form>
        </TankContentCard>
      </div>
    );
  }
}
