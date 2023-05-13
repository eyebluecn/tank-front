import { message } from 'antd';

/**
 * 消息弹出框，统一进行收口
 */
export default class MessageBoxUtil {
  static success(content: string) {
    message.success(content);
  }

  static info(content: string) {
    message.info(content);
  }

  static error(content: string) {
    message.error(content);
  }

  static warn(content: string) {
    message.warn(content);
  }

  static warning(content: string) {
    message.warning(content);
  }
}
