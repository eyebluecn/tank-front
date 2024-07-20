export const stopPropagation = (fn: Function) => {
  return (e: any) => {
    if (e) {
      if (e.stopPropagation) {
        //系统的点击事件
        e.stopPropagation()
      } else if (e.domEvent && e.domEvent.stopPropagation) {
        //antd的事件
        e.domEvent.stopPropagation()
      }
    }
    fn.call(null, e)
  }
}
