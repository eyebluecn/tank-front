import * as React from 'react';

/**
 * 定义了一个图标行为的对象，这个可以辅助一些组件。
 */
export interface IconActionItem {
  //图片的资源链接(优先级高于iconType)
  icon?: string;
  //antd的图标类型
  iconType?: string;
  //名称
  name?: string;
  //是否可见。默认可见
  visible?: boolean;
  //点击图标后的行为
  onClick?: () => void;
}

/**
 * 工具箱的条目，图标采用antd的图标。
 * 图标不带有高亮样式
 */
export interface ToolItem {
  name: string;

  //当前是否处于展开状态
  active: boolean;

  //antd的图标样式
  icon: React.ReactNode;
}

/**
 * 该接口可以像文件树一样展示。
 * 同时图标带有高亮样式
 */
export interface SkeletonItem {
  name: string;

  //当前是否处于展开状态
  active: boolean;

  //高亮的图标 资源链接
  activeIcon: string;

  //一般状态的图标 资源链接
  icon: string;
}

/**
 * 请求的Map，键值对
 */
export type RequestParamMap = { [key: string]: string };
