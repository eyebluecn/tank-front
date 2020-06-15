import React from "react";
import TankComponent from "../../../../common/component/TankComponent";
import { Checkbox, Modal } from "antd";
import SafeUtil from "../../../../common/util/SafeUtil";
import ImageCache from "../../../../common/model/image/cache/ImageCache";
import ImageUtil from "../../../../common/util/ImageUtil";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { DeleteFilled, ExclamationCircleFilled } from "@ant-design/icons";
import MessageBoxUtil from "../../../../common/util/MessageBoxUtil";
import FileUtil from "../../../../common/util/FileUtil";
import DateUtil from "../../../../common/util/DateUtil";
import "./ImageCachePanel.less";

interface IProps {
  imageCache: ImageCache;
  onCheckImageCache: (imageCache?: ImageCache) => any;
  onPreviewImageCache: (imageCache: ImageCache) => any;
  onDeleteSuccess: () => any;
}

interface IState {}

export default class ImageCachePanel extends TankComponent<IProps, IState> {
  //正在向服务器提交rename的请求
  renamingLoading = false;
  showMore = false;

  clickRow = () => {};

  checkToggle = (e: CheckboxChangeEvent) => {
    const { imageCache, onCheckImageCache } = this.props;
    imageCache.check = e.target.checked;
    onCheckImageCache(imageCache);
  };

  deleteImageCache = () => {
    Modal.confirm({
      title: "此操作不可撤回, 是否继续?",
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.props.imageCache.httpDel(() => {
          MessageBoxUtil.success("操作成功");
          this.props.onDeleteSuccess!();
        });
      },
    });
  };

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
          <div className="media">
            <div className="pull-left">
              <div className="left-part">
                <span className="basic-span basic-span-hot">
                  <Checkbox
                    onClick={(e) => SafeUtil.stopPropagationWrap(e)}
                    checked={imageCache.check}
                    onChange={this.checkToggle}
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
                  <DeleteFilled
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
            <div className="media-body">
              <div className="middle-part">
                <span className="image-cache-name">{imageCache.name}</span>
              </div>
            </div>

            {/*todo 在小屏下的操作栏*/}
          </div>
        </div>
      </div>
    );
  }
}
