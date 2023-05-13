import React from 'react';
import TankComponent from '../../../../common/component/TankComponent';
import { Checkbox, Modal } from 'antd';
import SafeUtil from '../../../../common/util/SafeUtil';
import ImageCache from '../../../../common/model/image/cache/ImageCache';
import ImageUtil from '../../../../common/util/ImageUtil';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  SmallDashOutlined,
} from '@ant-design/icons';
import MessageBoxUtil from '../../../../common/util/MessageBoxUtil';
import FileUtil from '../../../../common/util/FileUtil';
import DateUtil from '../../../../common/util/DateUtil';
import Expanding from '../../../widget/Expanding';
import './ImageCachePanel.less';
import StringUtil from '../../../../common/util/StringUtil';
import Lang from '../../../../common/model/global/Lang';

interface IProps {
  imageCache: ImageCache;
  onCheckImageCache: (imageCache?: ImageCache) => any;
  onPreviewImageCache: (imageCache: ImageCache) => any;
  onDeleteSuccess: () => any;
}

interface IState {}

export default class ImageCachePanel extends TankComponent<IProps, IState> {
  // 小屏幕下操作栏
  showMore = false;

  checkToggle(e: CheckboxChangeEvent) {
    const { imageCache, onCheckImageCache } = this.props;
    imageCache.check = e.target.checked;
    onCheckImageCache(imageCache);
  }

  deleteImageCache() {
    Modal.confirm({
      title: Lang.t('actionCanNotRevertConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.props.imageCache.httpDel(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.props.onDeleteSuccess!();
        });
      },
    });
  }

  toggleHandles() {
    this.showMore = !this.showMore;
    this.updateUI();
  }

  render() {
    const { imageCache } = this.props;

    return (
      <div className="widget-image-cache-panel">
        <div
          onClick={(e) =>
            SafeUtil.stopPropagationWrap(e)(
              this.props.onPreviewImageCache(imageCache)
            )
          }
        >
          <div className="media clearfix">
            <div className="pull-left">
              <div className="left-part">
                <span className="basic-span basic-span-hot">
                  <Checkbox
                    onClick={(e) => SafeUtil.stopPropagationWrap(e)}
                    checked={imageCache.check}
                    onChange={(e) => this.checkToggle(e)}
                  />
                </span>
                <span className="basic-span">
                  <img
                    className="image-cache-icon"
                    src={ImageUtil.handleImageUrl(
                      imageCache.getOriginUrl(),
                      false,
                      100,
                      100
                    )}
                  />
                </span>
              </div>
            </div>

            {/*在大屏下的操作栏*/}
            <div className="pull-right visible-pc">
              {imageCache.uuid ? (
                <div className="right-part">
                  <DeleteOutlined
                    title={Lang.t('delete')}
                    className="image-cache-operation btn-action red"
                    onClick={(e) =>
                      SafeUtil.stopPropagationWrap(e)(this.deleteImageCache())
                    }
                  />
                  <span className="image-cache-size">
                    {FileUtil.humanFileSize(imageCache.size)}
                  </span>
                  <span className="image-cache-date">
                    {DateUtil.simpleDateHourMinute(imageCache.updateTime)}
                  </span>
                </div>
              ) : null}
            </div>

            {/*在小屏下的操作栏*/}
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
                <span className="image-cache-name">{imageCache.name}</span>
              </div>
            </div>
          </div>
          <Expanding>
            {this.showMore ? (
              <div className="more-panel">
                <div className="cell-btn text">
                  <span>
                    {DateUtil.simpleDateHourMinute(imageCache.updateTime)}
                  </span>
                  <span className="matter-size">
                    {StringUtil.humanFileSize(imageCache.size)}
                  </span>
                </div>
                <div
                  className="cell-btn red"
                  onClick={(e) =>
                    SafeUtil.stopPropagationWrap(e)(this.deleteImageCache())
                  }
                >
                  <DeleteOutlined className="btn-action mr5" />
                  {Lang.t('delete')}
                </div>
              </div>
            ) : null}
          </Expanding>
        </div>
      </div>
    );
  }
}
