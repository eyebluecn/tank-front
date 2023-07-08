/**
 * 面包屑对应的模型
 */
export default interface BreadcrumbModel {
  name: string;
  path: string;
  query: any;
  displayDirect: boolean;
  onClick?: () => void;
}
