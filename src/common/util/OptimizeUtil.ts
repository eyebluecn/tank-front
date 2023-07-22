export const debounce = (func: Function, wait: number) => {
  let timer: any = null;
  return (args?: any) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.call(this, args);
    }, wait);
  };
};
