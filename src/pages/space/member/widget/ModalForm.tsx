import Lang from '../../../../common/model/global/Lang';
import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FORM_LAYOUT } from '../../../../common/const/Form';
import { SpaceMemberFormValues } from '../../../../common/model/space/member/SpaceMember';
import { SpaceMemberRoleList } from '../../../../common/model/space/member/SpaceMemberRole';
import Pager from '../../../../common/model/base/Pager';
import User from '../../../../common/model/user/User';

interface Props {
  mode: 'create' | 'edit';
  initialValues?: SpaceMemberFormValues;
  onOk: (values: SpaceMemberFormValues) => void;
  onCancel: () => void;
}
const ModalForm = ({ mode, initialValues, onOk, onCancel }: Props) => {
  const isCreate = mode === 'create';
  const userPager = useRef(new Pager<User>(null, User, 100));
  const [form] = Form.useForm<SpaceMemberFormValues>();
  const [userList, setUserList] = useState<User[]>([]); // 用户列表

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    userPager.current.httpList(() => {
      setUserList(userPager.current.data);
    });
  };

  const handleSearchUser = (value?: string) => {
    userPager.current.setFilterValue('username', value);
    refresh();
  };

  return (
    <Modal
      visible
      title={isCreate ? Lang.t('create') : Lang.t('edit')}
      onOk={form.submit}
      onCancel={onCancel}
      okText={Lang.t('confirm')}
      cancelText={Lang.t('cancel')}
    >
      <Form
        {...FORM_LAYOUT}
        form={form}
        onFinish={onOk}
        initialValues={initialValues}
      >
        {/*编辑时暂存uuid*/}
        <Form.Item name="uuid" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="userUuid"
          label={Lang.t('space.member')}
          rules={[{ required: true, message: Lang.t('selectRequired') }]}
        >
          <Select
            options={userList.map((item) => ({
              label: item.username,
              value: item.uuid,
            }))}
            placeholder={Lang.t('space.memberTip')}
            disabled={!isCreate}
            showSearch
            allowClear
            filterOption={false}
            onSearch={handleSearchUser}
          />
        </Form.Item>
        <Form.Item
          name="role"
          label={Lang.t('space.memberRole')}
          rules={[{ required: true, message: Lang.t('selectRequired') }]}
        >
          <Select
            allowClear
            placeholder={Lang.t('space.memberRoleTip')}
            options={SpaceMemberRoleList.map((item) => ({
              label: item.name,
              value: item.value,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
