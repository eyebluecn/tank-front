export default class NumberUtil {

  //求最大公约数
  static gcd(a, b) {
    return b ? NumberUtil.gcd(b, a % b) : a;
  };

  //约分 numerator:分子 denominator:分母
  static reduce(numerator, denominator) {

    let maxFactor = NumberUtil.gcd(numerator, denominator);
    return [numerator / maxFactor, denominator / maxFactor];
  }

  //比较两个分数是否相等
  static fractionEqual(numerator1, denominator1, numerator2, denominator2) {
    let fraction1 = NumberUtil.reduce(numerator1, denominator1);
    let fraction2 = NumberUtil.reduce(numerator2, denominator2);

    return fraction1[0] === fraction2[0] && fraction1[1] === fraction2[1];
  }

}
