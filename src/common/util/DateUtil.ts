import moment from 'moment';

export default class DateUtil {
  static DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  static DEFAULT_HOUR_MINUTE = 'YYYY-MM-DD HH:mm';
  static SLASH_DATE_FORMAT = 'YYYY/MM/DD';
  static TIME_FORMAT = 'HH:mm:ss';
  static DATE_FORMAT = 'YYYY-MM-DD';
  //紧凑型的时间格式
  static COMPACT_DATE_FORMAT = 'YYYYMMDD';

  static simpleDateHourMinute(date: Date | null): string {
    if (date == null) {
      return '';
    } else {
      return moment(date).format(DateUtil.DEFAULT_HOUR_MINUTE);
    }
  }

  static simpleDateTime(date: Date | null): string {
    if (date == null) {
      return '';
    } else {
      return moment(date).format(DateUtil.DEFAULT_FORMAT);
    }
  }

  static simpleDate(date: Date | null): string {
    if (date == null) {
      return '';
    } else {
      return moment(date).format(DateUtil.DATE_FORMAT);
    }
  }

  /**
   * 某个日期的前一天
   */
  static lastDay(date: Date | null, format?: string): string {
    if (format === undefined) {
      format = DateUtil.DEFAULT_FORMAT;
    }

    if (date == null) {
      return '';
    } else {
      return moment(date).add(-1, 'days').format(format);
    }
  }

  /**
   * 按照指定格式进行格式化
   */
  static format(date: Date | null, formatString: string): string {
    if (date == null) {
      return '';
    } else {
      return moment(date).format(formatString);
    }
  }

  /**
   * 将字符串，按照指定的格式反序列化成为时间对象
   * @param str
   */
  static parse(str: string): Date | null {
    let valid = moment(str).isValid();
    if (valid) {
      return moment(str).toDate();
    } else {
      return null;
    }
  }

  //将时间字符串转化成js date
  //deprecated,使用 parse方法替代。
  static str2Date(str: any): Date {
    let valid = moment(str).isValid();
    if (valid) {
      return moment(str).toDate();
    } else {
      //console.warn("不能转换成时间对象:", str)
      return new Date();
    }
  }
}
