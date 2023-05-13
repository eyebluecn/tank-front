import React from 'react';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
  SmallDashOutlined,
} from '@ant-design/icons';
import TankComponent from '../../../common/component/TankComponent';
import SafeUtil from '../../../common/util/SafeUtil';
import DateUtil from '../../../common/util/DateUtil';
import Expanding from '../../widget/Expanding';
import Share from '../../../common/model/share/Share';
import Sun from '../../../common/model/global/Sun';
import './ShareBar.less';
import { Modal, Tooltip } from 'antd';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import ShareDialogModal from './ShareDialogModal';
import Lang from '../../../common/model/global/Lang';

interface IProps {
  share: Share;
  onDeleteSuccess: () => any;
}

interface IState {}

export default class ShareBar extends TankComponent<IProps, IState> {
  // 小屏幕下操作栏
  showMore = false;

  constructor(props: IProps) {
    super(props);
  }

  showShare() {
    ShareDialogModal.open(this.props.share);
  }

  delShare() {
    Modal.confirm({
      title: Lang.t('actionCanNotRevertConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.props.share.httpDel(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.props.onDeleteSuccess();
        });
      },
    });
  }

  toggleHandles() {
    this.showMore = !this.showMore;
    this.updateUI();
  }

  render() {
    const { share } = this.props;
    const { showMore } = this;
    return (
      <div className="widget-share-bar">
        <div
          onClick={(e) =>
            SafeUtil.stopPropagationWrap(e)(
              Sun.navigateTo(`/share/detail/${share.uuid}`)
            )
          }
        >
          <div className="media">
            <div className="pull-left">
              <div className="left-part">
                <span className="basic-span">
                  <img className="share-icon" src={share.getIcon()} />
                </span>
              </div>
            </div>

            {/*在大屏下的操作栏*/}
            <div className="pull-right visible-pc">
              <div className="right-part">
                <span className="share-operation">
                  <Tooltip title={Lang.t('share.shareDetail')}>
                    <InfoCircleOutlined
                      className="btn-action mr5 text-theme"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(this.showShare())
                      }
                    />
                  </Tooltip>
                  <Tooltip title={Lang.t('delete')}>
                    <DeleteOutlined
                      className="btn-action text-danger"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(this.delShare())
                      }
                    />
                  </Tooltip>
                </span>

                <Tooltip title={Lang.t('share.shareTime')}>
                  <span className="share-date">
                    {DateUtil.simpleDateHourMinute(share.updateTime)}
                  </span>
                </Tooltip>

                <Tooltip title={Lang.t('share.expireTime')}>
                  <span className="share-date text-center">
                    {share.expireInfinity
                      ? Lang.t('share.noExpire')
                      : DateUtil.simpleDateHourMinute(share.expireTime)}
                  </span>
                </Tooltip>
              </div>
            </div>

            {/*在小屏幕下的操作栏*/}
            <div className="pull-right visible-mobile">
              <span
                className="more-btn"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.toggleHandles())
                }
              >
                <SmallDashOutlined className="btn-action navy f18" />
              </span>
            </div>

            <div className="media-body">
              <div className="middle-part">
                <span className="share-name">
                  {share.name}
                  {share.hasExpired() ? (
                    <span className="text-danger">
                      {Lang.t('share.expired')}
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Expanding>
          {showMore ? (
            <div className="more-panel">
              <div className="cell-btn text">
                <span>
                  {Lang.t('share.shareTime')}:{' '}
                  {DateUtil.simpleDateHourMinute(share.createTime)}
                </span>
                <span className="ml10">
                  {share.expireInfinity
                    ? Lang.t('share.noExpire')
                    : `${Lang.t('expireTime')}：${DateUtil.simpleDateHourMinute(
                        share.expireTime
                      )}`}
                </span>
              </div>

              <div
                className="cell-btn"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.showShare())
                }
              >
                <InfoCircleOutlined className="btn-action mr5" />
                {Lang.t('share.shareDetail')}
              </div>

              <div
                className="cell-btn red"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.delShare())
                }
              >
                <DeleteOutlined className="btn-action" />
                {Lang.t('delete')}
              </div>
            </div>
          ) : null}
        </Expanding>
      </div>
    );
  }
}
