//导演类，用户来让整个工作有序进行
export default class Director {
  constructor(args) {
    //正在重命名
    this.renameMode = false
    //正在创建新文件夹
    this.createMode = false
    //正在移动文件
    this.moveMode = false
  }

  isEditing() {
    return this.renameMode || this.createMode || this.moveMode
  }

}
