//将一个json字符串转换成 json 数组
export function parseList(str) {
  if (!str) {
    return []
  }
  if (str instanceof Array) {
    return str;
  }
  try {
    let list = JSON.parse(str);
    if (list instanceof Array) {
      return list;
    } else {
      console.error("不能将" + str + "转换成数组");
      return [];
    }
  } catch (e) {
    console.error("不能将" + str + "转换成JSON");
    return [];
  }
}
