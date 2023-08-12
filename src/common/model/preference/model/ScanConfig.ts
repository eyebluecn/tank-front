/**
 * 扫描配置
 */
import { LabeledValue } from 'antd/lib/select';
import Base from '../../base/Base';
import { ScanScopeType } from './ScanScopeType';
import { ScanCronType } from './ScanCronType';

export default class ScanConfig extends Base {
  // 是否开启
  enable: boolean = false;
  // cron表达式 定时任务用
  cron: string | null = null;
  // 扫描磁盘开启范围（全部用户 or 局部用户）
  scope: ScanScopeType = ScanScopeType.ALL;
  // 开启扫描磁盘功能的空间
  spaceNames: string[] = [];

  // 前端辅助字段
  cronType: string | null = null;

  constructor() {
    super();
  }

  assign(obj: any) {
    super.assign(obj);
  }

  getForm(): any {
    return {
      enable: this.enable,
      scope: this.scope,
      cron: this.cronType === ScanCronType.CUSTOM ? this.cron : this.cronType,
      spaceNames: this.spaceNames,
    };
  }
}
