export default class Menu {
  constructor(name, path, active = false, icon = null, children = []) {

    this.name = name;
    this.active = active;
    this.icon = icon;
    this.router = {
      path: path
    };
    this.children = children;
  }

  add = function (menu) {
    this.children.push(menu);
  }
}



