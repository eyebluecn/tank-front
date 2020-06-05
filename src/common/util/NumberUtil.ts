export default class NumberUtil {


  static isInteger(obj: any) {
    return typeof obj === 'number' && obj % 1 === 0
  }

  //转换成整型
  static parseInt(obj: any): number {

    try {
      return parseInt(obj)
    } catch (e) {
      console.error("无法转换成整数", obj)
      return 0
    }

  }

}
