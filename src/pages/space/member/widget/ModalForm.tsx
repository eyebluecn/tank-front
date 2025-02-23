import Lang from '../../../../common/model/global/Lang';
import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FORM_LAYOUT } from '../../../../common/const/Form';
import SpaceMember from '../../../../common/model/space/member/SpaceMember';
import {
  SpaceMemberRole,
  SpaceMemberRoleList,
} from '../../../../common/model/space/member/SpaceMemberRole';
import User from '../../../../common/model/user/User';

export interface SpaceMemberModalFormValues {
  userUuids: string[];
  role: SpaceMemberRole;
}

interface Props {
  mode: 'create' | 'edit';
  targetSpaceMember?: SpaceMember;
  onOk: (values: SpaceMemberModalFormValues) => void;
  onCancel: () => void;
}
const ModalForm = ({ mode, targetSpaceMember, onOk, onCancel }: Props) => {
  const isCreate = mode === 'create';
  const [form] = Form.useForm<SpaceMemberModalFormValues>();
  const [userList, setUserList] = useState<User[]>([]); // 用户列表
  const initialValues: SpaceMemberModalFormValues | undefined =
    targetSpaceMember
      ? {
          userUuids: [targetSpaceMember.userUuid!],
          role: targetSpaceMember.role!,
        }
      : undefined;

  const refreshUserList = (keyword?: string) => {
    User.httpSearch(keyword, (res: any) => {
      setUserList(res.data.data);
    });
  };

  useEffect(() => {
    refreshUserList();
  }, []);

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
        <Form.Item
          name="userUuids"
          label={Lang.t('space.member')}
          rules={[{ required: true, message: Lang.t('selectRequired') }]}
        >
          <Select
            options={userList.map((item) => ({
              label: item.username,
              value: item.uuid,
            }))}
            mode="multiple"
            placeholder={Lang.t('space.memberTip')}
            disabled={!isCreate}
            showSearch
            allowClear
            filterOption={false}
            onSearch={refreshUserList}
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
