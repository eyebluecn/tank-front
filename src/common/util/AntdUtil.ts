import DateUtil from './DateUtil';

/**
 * 这个类是专门为antd服务的
 */
export default class AntdUtil {
  /**
   * 从一个数组中，获取到antd table想要的那种dataSource格式
   */
  static getDataSource(columns: any, data: any) {
    let dataSource: any = [];
    if (!(columns instanceof Array && data instanceof Array)) {
      console.error('columns和data必须为数组');
      return dataSource;
    }

    data.forEach((item, index) => {
      let obj: any = { key: index, id: item.id };

      columns.forEach((column, i) => {
        let value = item[column.key];

        //遇到时间自动转成 yyyy-MM-dd HH:mm:ss
        if (value instanceof Date) {
          value = DateUtil.simpleDateTime(value);
        }

        obj[column.key] = value;
      });

      dataSource.push(obj);
    });

    return dataSource;
  }
}
