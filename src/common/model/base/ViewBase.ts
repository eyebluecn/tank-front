/**
 *
 * 基类。
 *
 * 这个类附带了一个视图，通过对这个类的操作可以对对应的视图进行更新等操作。
 * Castle中的类，大多数直接继承这个类。
 */
import Base from './Base';
import React from 'react';

export default class ViewBase extends Base {
  //该类对应的React视图。
  reactComponent: React.Component | null = null;

  //更新某一个组件对应的UI
  static updateComponentUI(component: React.Component | null, entity?: any) {
    if (component) {
      //_version在这里是充当fake的。
      component.setState({ _version: new Date().getTime() });
    } else {
      console.warn(
        `${
          entity && entity.constructor ? entity.constructor.name : '未知对象'
        } 的 reactComponent 不存在，无法更新其对应的UI`
      );
    }
  }

  //更新当前的视图
  updateUI() {
    ViewBase.updateComponentUI(this.reactComponent, this);
  }
}
