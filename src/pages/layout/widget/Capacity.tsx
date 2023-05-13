import React from 'react';
import { Progress } from 'antd';
import TankComponent from '../../../common/component/TankComponent';
import FileUtil from '../../../common/util/FileUtil';
import Moon from '../../../common/model/global/Moon';
import User from '../../../common/model/user/User';
import { debounce } from '../../../common/util/OptimizeUtil';
import './Capacity.less';

interface IProps {}

interface IState {}

export default class Capacity extends TankComponent<IProps, IState> {
  user: User = Moon.getSingleton().user;
  //持有全局唯一的实例。
  static instance: Capacity | null = null;

  refresh = debounce(() => {
    this.user.httpInfo(false, () => this.updateUI());
  }, 1000);

  constructor(props: IProps) {
    super(props);
    Capacity.instance = this;
  }

  render() {
    const { user } = this;
    return (
      <div className="widget-capacity">
        {user.totalSizeLimit !== -1 && (
          <Progress
            percent={(user.totalSize / user.totalSizeLimit) * 100}
            showInfo={false}
            strokeColor="#215891"
            trailColor="#ddd"
          />
        )}
        <div className="capacity-text">
          {`${FileUtil.humanFileSize(
            user.totalSize
          )} / ${FileUtil.humanFileSize(user.totalSizeLimit)}`}
        </div>
      </div>
    );
  }
}
