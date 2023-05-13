//导演类，用户来让整个工作有序进行
export default class Director {
  //正在重命名
  renameMode: boolean = false;
  //正在创建新文件夹
  createMode: boolean = false;
  //正在移动文件
  moveMode: boolean = false;

  isEditing() {
    return this.renameMode || this.createMode || this.moveMode;
  }
}
