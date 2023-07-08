import React from 'react';
import Matter from '../../../common/model/matter/Matter';
import TankComponent from '../../../common/component/TankComponent';
import './ShareMatterPanel.less';
import StringUtil from '../../../common/util/StringUtil';
import DateUtil from '../../../common/util/DateUtil';
import Expanding from '../../widget/Expanding';
import {
  DownloadOutlined,
  EllipsisOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import SafeUtil from '../../../common/util/SafeUtil';
import Lang from '../../../common/model/global/Lang';
import Share from '../../../common/model/share/Share';
import ImageUtil from '../../../common/util/ImageUtil';

interface IProps {
  matter: Matter;
  share: Share;
  currentShareRootUuid: string;
  onPreviewImage: (matter: Matter) => any;
  onGoToDirectory: (id: string) => any;
}

interface IState {}

export default class ShareMatterPanel extends TankComponent<IProps, IState> {
  // 小屏幕下操作栏
  showMore: boolean = false;

  constructor(props: IProps) {
    super(props);
  }

  clickRow() {
    const {
      matter,
      share,
      currentShareRootUuid,
      onGoToDirectory,
      onPreviewImage,
    } = this.props;

    if (matter.dir) {
      onGoToDirectory(matter.uuid!);
    } else {
      //图片进行预览操作
      if (matter.isImage()) {
        onPreviewImage(matter);
      } else {
        matter.preview(
          matter.getSharePreviewUrl(
            share.uuid!,
            share.code!,
            currentShareRootUuid
          )
        );
      }
    }
  }

  getIcon() {
    const { matter, share, currentShareRootUuid } = this.props;
    if (matter.isImage()) {
      return ImageUtil.handleImageUrl(
        matter.getSharePreviewUrl(
          share.uuid!,
          share.code!,
          currentShareRootUuid
        ),
        false,
        100,
        100
      );
    } else {
      return matter.getIcon();
    }
  }

  download() {
    const { matter, share, currentShareRootUuid } = this.props;
    matter.download(
      matter.getShareDownloadUrl(share.uuid!, share.code!, currentShareRootUuid)
    );
  }

  toggleHandles() {
    this.showMore = !this.showMore;
    this.updateUI();
  }

  render() {
    const { matter } = this.props;

    return (
      <div className="widget-share-matter-panel">
        <div onClick={(e) => SafeUtil.stopPropagationWrap(e)(this.clickRow())}>
          <div className="media clearfix">
            <div className="pull-left">
              <div className="left-part">
                <span className="cell">
                  <img className="matter-icon" src={this.getIcon()} />
                </span>
              </div>
            </div>

            {/*在大屏幕下的操作栏*/}
            <div className="pull-right visible-pc">
              <div className="right-part">
                <Tooltip title={Lang.t('download')}>
                  <DownloadOutlined
                    className="btn-action text-theme"
                    onClick={(e) =>
                      SafeUtil.stopPropagationWrap(e)(this.download())
                    }
                  />
                </Tooltip>

                <Tooltip title={Lang.t('matter.size')}>
                  <span className="matter-size">
                    {StringUtil.humanFileSize(matter.size)}
                  </span>
                </Tooltip>

                <Tooltip title={Lang.t('matter.updateTime')}>
                  <span className="matter-date mr10">
                    {DateUtil.simpleDateHourMinute(matter.updateTime)}
                  </span>
                </Tooltip>
              </div>
            </div>

            <div className="pull-right visible-mobile">
              <span
                className="more-btn"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.toggleHandles())
                }
              >
                <EllipsisOutlined className="btn-action navy f18" />
              </span>
            </div>

            <div className="media-body">
              <div className="middle-part">
                <span className="matter-name">
                  {matter.name}
                  {!matter.dir && !matter.privacy && (
                    <Tooltip
                      title={Lang.t('matter.publicFileEveryoneCanVisit')}
                    >
                      <UnlockOutlined className="icon" />
                    </Tooltip>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Expanding>
          {this.showMore ? (
            <div className="more-panel">
              <div className="cell-btn navy text">
                <span>{DateUtil.simpleDateHourMinute(matter.updateTime)}</span>
                <span className="matter-size">
                  {StringUtil.humanFileSize(matter.size)}
                </span>
              </div>
              <div
                className="cell-btn navy"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.download())
                }
              >
                <DownloadOutlined className="btn-action mr5" />
                {Lang.t('matter.download')}
              </div>
            </div>
          ) : null}
        </Expanding>
      </div>
    );
  }
}
