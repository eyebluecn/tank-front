export default class ArrayUtil {
  //从srcArray中减去childArray的元素
  static substract(srcArray: [], childArray: any) {
    if (!srcArray) {
      return [];
    }

    if (!childArray || childArray.length === 0) {
      return srcArray;
    }

    let newArray: [] = [];

    for (let i = 0; i < srcArray.length; i++) {
      //在childArray的那些元素就不要了。
      if (childArray.indexOf(srcArray[i]) === -1) {
        newArray.push(srcArray[i]);
      }
    }
    return newArray;
  }

  //不重复添加
  static uniqueAdd(srcArray: any, childArray: any) {
    if (!srcArray) {
      srcArray = [];
    }

    if (!childArray || childArray.length === 0) {
      return srcArray;
    }

    for (let i = 0; i < childArray.length; i++) {
      //在childArray的那些元素就不要了。
      if (srcArray.indexOf(childArray[i]) === -1) {
        srcArray.push(childArray[i]);
      }
    }
    return srcArray;
  }

  //不重复添加
  static uniqueAddOne(srcArray: any[], child: any) {
    if (!srcArray) {
      srcArray = [];
    }

    if (child === undefined || child === null) {
      return srcArray;
    }

    //在childArray的那些元素就不要了。
    if (srcArray.indexOf(child) === -1) {
      srcArray.push(child);
    }

    return srcArray;
  }

  //数组中查找特定元素并返回所有该元素的索引
  static findAll(a: any, x: any) {
    let results: number[] = [],
      len = a.length,
      pos: number = 0;
    while (pos < len) {
      pos = a.indexOf(x, pos);
      if (pos === -1) {
        //未找到就退出循环完成搜索
        break;
      }
      results.push(pos); //找到就存储索引
      pos += 1; //并从下个位置开始搜索
    }
    return results;
  }

  //调整元素位置。将dragIndex的元素放到hoverIndex的前面，其余顺移。在拖拽排序中用到。
  static insertSort(arr: any, dragIndex: any, hoverIndex: any) {
    if (!(arr instanceof Array)) {
      return;
    }

    if (dragIndex < 0 || dragIndex >= arr.length) {
      console.error(
        'dragIndex = ' + dragIndex + ' index越界 length = ' + arr.length
      );
      return;
    }

    if (hoverIndex < 0 || hoverIndex >= arr.length) {
      console.error(
        'hoverIndex = ' + hoverIndex + ' index越界 length = ' + arr.length
      );
      return;
    }

    if (dragIndex === hoverIndex) {
      return;
    }

    if (dragIndex > hoverIndex) {
      let temp = arr[dragIndex];

      for (let i = dragIndex; i >= hoverIndex + 1; i--) {
        arr[i] = arr[i - 1];
      }
      arr[hoverIndex] = temp;
    } else {
      let temp = arr[dragIndex];

      for (let i = dragIndex; i <= hoverIndex - 1; i++) {
        arr[i] = arr[i + 1];
      }
      arr[hoverIndex] = temp;
    }
  }

  //数组去重
  static unique(arr: string[]) {
    let newArr: string[] = [];
    for (let i = 0, item; (item = arr[i++]); ) {
      if (newArr.indexOf(item) === -1) {
        newArr.push(item);
      }
    }
    return newArr;
  }
}
