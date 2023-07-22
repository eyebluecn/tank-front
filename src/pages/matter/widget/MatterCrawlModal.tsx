import React, { useState } from 'react';
import { Form, Input, message, Modal, Space, Tooltip } from 'antd';
import Lang from '../../../common/model/global/Lang';
import { FORM_LAYOUT } from '../../../common/const/Form';
import { debounce } from '../../../common/util/OptimizeUtil';
import Matter from '../../../common/model/matter/Matter';
import { QuestionCircleOutlined } from '@ant-design/icons';

export interface ICrawlFormValues {
  link: string;
  filename: string;
}
interface IProps {
  spaceUuid: string;
  puuid: string;
  onClose: () => void;
}

const MatterCrawlModal = ({ spaceUuid, puuid, onClose }: IProps) => {
  const [form] = Form.useForm<ICrawlFormValues>();
  const [filenameFocusFlag, setFilenameFocusFlag] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleChangeCrawlLink = debounce((link: string) => {
    if (filenameFocusFlag) return; // 如果用户光标移入过filename输入框，则不自动填充filename
    try {
      const url = new URL(link);
      const filename = url.pathname.split('/').pop();
      form.setFieldsValue({
        filename,
      });
    } catch (e) {
      form.setFieldsValue({
        filename: undefined,
      });
    }
  }, 200);

  const handleConfirm = () => {
    const values = form.getFieldsValue(true);
    setConfirmLoading(true);
    Matter.httpCrawl(
      {
        url: values.link,
        filename: values.filename,
        spaceUuid,
        puuid,
      },
      () => {
        message.success(Lang.t('matter.crawlSuccessTip'));
        onClose();
      },
      null,
      () => {
        setConfirmLoading(false);
      }
    );
  };

  return (
    <Modal
      visible
      title={
        <Space>
          {Lang.t('matter.crawl')}
          <Tooltip title={Lang.t('matter.crawlDescription')}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      }
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      okText={Lang.t('confirm')}
      cancelText={
        confirmLoading ? Lang.t('matter.crawlBackground') : Lang.t('cancel')
      }
    >
      <Form form={form} {...FORM_LAYOUT} onFinish={handleConfirm}>
        <Form.Item
          label={Lang.t('matter.crawlLink')}
          name="link"
          rules={[{ required: true, message: Lang.t('matter.crawlLinkTip') }]}
        >
          <Input
            placeholder={Lang.t('matter.crawlLinkTip')}
            onChange={(e) => handleChangeCrawlLink(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label={Lang.t('matter.crawlFilename')}
          name="filename"
          rules={[
            { required: true, message: Lang.t('matter.crawlFilenameTip') },
          ]}
        >
          <Input
            placeholder={Lang.t('matter.crawlFilenameTip')}
            onFocus={() => setFilenameFocusFlag(true)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MatterCrawlModal;
