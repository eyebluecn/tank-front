import {ToolItem} from "../types";

export default class MenuItem implements ToolItem {
  name: string;
  url: string;
  iconType: string;
  active: boolean = false;


  constructor(name: string, url: string, iconType: string) {
    this.name = name;
    this.url = url;
    this.iconType = iconType;

    //当前的url完全一致，那么就高亮显示
    if (url == "/user/login") {
      this.active = window.location.pathname === url || window.location.pathname === "/user/register"
    } else {
      this.active = window.location.pathname === url
    }

  }
}
