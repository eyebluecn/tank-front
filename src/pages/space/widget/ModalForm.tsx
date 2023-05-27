import React from 'react';
import { Form, Input, Modal } from 'antd';
import Lang from '../../../common/model/global/Lang';
import InputSize from '../../widget/form/InputSize';
import { FormValues } from '../../../common/model/space/Space';

interface Props {
  mode: 'create' | 'edit';
  initialValues?: FormValues;
  onOk: (values: FormValues) => void;
  onCancel: () => void;
}
const ModalForm = ({ mode, initialValues, onOk, onCancel }: Props) => {
  const isCreate = mode === 'create';
  const [form] = Form.useForm<FormValues>();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
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
        {...layout}
        form={form}
        onFinish={onOk}
        initialValues={initialValues}
      >
        {/*编辑时暂存uuid*/}
        <Form.Item name="uuid" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={Lang.t('space.name')}
          rules={[{ required: true, message: Lang.t('inputRequired') }]}
        >
          <Input placeholder={Lang.t('space.nameTip')} disabled={!isCreate} />
        </Form.Item>
        <Form.Item
          name="sizeLimit"
          label={Lang.t('space.sizeLimit')}
          rules={[{ required: true, message: Lang.t('inputRequired') }]}
        >
          <InputSize placeholder={Lang.t('space.sizeLimitTip')} />
        </Form.Item>
        <Form.Item
          name="totalSizeLimit"
          label={Lang.t('space.totalSizeLimit')}
          rules={[{ required: true, message: Lang.t('inputRequired') }]}
        >
          <InputSize placeholder={Lang.t('space.totalSizeLimitTip')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
