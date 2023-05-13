export default class NumberUtil {
  //求最大公约数
  static gcd(a: number, b: number): number {
    return b ? NumberUtil.gcd(b, a % b) : a;
  }

  //约分 numerator:分子 denominator:分母
  static reduce(numerator: number, denominator: number) {
    let maxFactor = NumberUtil.gcd(numerator, denominator);
    return [numerator / maxFactor, denominator / maxFactor];
  }

  static isInteger(obj: any) {
    return typeof obj === 'number' && obj % 1 === 0;
  }

  //转换成整型
  static parseInt(obj: any): number {
    try {
      return parseInt(obj);
    } catch (e) {
      console.error('无法转换成整数', obj);
      return 0;
    }
  }

  //比较两个分数是否相等
  static fractionEqual(
    numerator1: number,
    denominator1: number,
    numerator2: number,
    denominator2: number
  ) {
    let fraction1 = NumberUtil.reduce(numerator1, denominator1);
    let fraction2 = NumberUtil.reduce(numerator2, denominator2);

    return fraction1[0] === fraction2[0] && fraction1[1] === fraction2[1];
  }
}
