export const debounce = (func: Function, wait: number) => {
    let timer: any = null;
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(func, wait);
    };
};
