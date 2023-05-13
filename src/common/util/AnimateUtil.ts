import SafeUtil from './SafeUtil';

export default class AnimateUtil {
  /**
   * 动画函数
   * @param startValue 开始的值
   * @param endValue 结束的值
   * @param duration 动画持续时间，单位ms 如果开始值和结束值一样，那么会提前结束。
   * @param processHandler 过程中处理的回调函数. 该函数能保证第一个值是startValue，结束的值是endValue
   * @param startHandler 开始的回调函数
   * @param endHandler 结束的回调函数
   * @param standard 每隔多少毫秒进行一次处理。
   *
   */
  static animate(
    startValue: number,
    endValue: number,
    duration: number,
    processHandler: (value: number) => void,
    startHandler?: (value: number) => void,
    endHandler?: (value: number) => void,
    standard?: number
  ): void {
    //规则校验。
    if (duration <= 0) {
      console.error('duration值只能是正整数');
      return;
    }

    if (standard == undefined) {
      standard = 20;
    } else if (standard <= 0) {
      console.error('standard值只能是正整数');
      return;
    }

    let totalStep: number = endValue - startValue;

    //从startValue到endValue需要触发几次。
    let num = Math.ceil(duration / standard);

    //每一步的长度
    let delta: number = totalStep;
    if (num != 0) {
      delta = Math.ceil(totalStep / num);
    }

    //定时执行
    let sum = 0;
    SafeUtil.safeCallback(startHandler)(startValue);
    processHandler(startValue);
    let intervalHandler = setInterval(() => {
      sum = sum + delta;
      if (Math.abs(sum) >= Math.abs(totalStep)) {
        //该停止了
        processHandler(endValue);
        SafeUtil.safeCallback(endHandler)(endValue);

        //关闭定时器。
        clearInterval(intervalHandler);
      } else {
        //更新当前进度
        processHandler(startValue + sum);
      }
    }, standard);
  }

  static setInputSelection(
    input: HTMLInputElement,
    startPos: number,
    endPos: number
  ) {
    input.focus();
    if (typeof input.selectionStart !== 'undefined') {
      input.selectionStart = startPos;
      input.selectionEnd = endPos;
    } else if (
      (document as any).selection &&
      (document as any).selection.createRange
    ) {
      // IE branch
      input.select();
      let range = (document as any).selection.createRange();
      range.collapse(true);
      range.moveEnd('character', endPos);
      range.moveStart('character', startPos);
      range.select();
    }
  }
}
