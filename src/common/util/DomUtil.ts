export default class DomUtil {
  static addEvent(
    el: Node,
    event: string,
    handler: (evt: Event) => void
  ): void {
    if (el.addEventListener) {
      el.addEventListener(event, handler, true);
    } else {
      console.error('不支持事件监听！', el);
    }
  }

  static removeEvent(
    el: Node,
    event: string,
    handler: (evt: Event) => void
  ): void {
    if (el.removeEventListener) {
      el.removeEventListener(event, handler, true);
    } else {
      console.error('不支持事件监听！', el);
    }
  }
}
