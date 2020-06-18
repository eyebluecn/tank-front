import React from "react";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  SmallDashOutlined,
} from "@ant-design/icons";
import TankComponent from "../../../common/component/TankComponent";
import SafeUtil from "../../../common/util/SafeUtil";
import DateUtil from "../../../common/util/DateUtil";
import Expanding from "../../widget/Expanding";
import Share from "../../../common/model/share/Share";
import Sun from "../../../common/model/global/Sun";

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

  showShare = () => {};

  delShare = () => {};

  toggleHandles = () => {
    this.showMore = !this.showMore;
    this.updateUI();
  };

  render() {
    const { share } = this.props;
    const { showMore } = this;
    return (
      <div className="widget-share-bar">
        <div onClick={e => SafeUtil.stopPropagationWrap(e)(Sun.navigateTo(`/share/detail/${share.uuid}`))}>
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
                <span
                  className="share-operation"
                  onClick={(e) =>
                    SafeUtil.stopPropagationWrap(e)(this.showShare())
                  }
                >
                  <InfoCircleOutlined className="btn-action mr5" />
                </span>
                <span
                  className="share-operation"
                  onClick={(e) =>
                    SafeUtil.stopPropagationWrap(e)(this.delShare())
                  }
                >
                  <DeleteOutlined className="btn-action red" />
                </span>

                <span className="share-date">
                  {DateUtil.simpleDateHourMinute(share.updateTime)}
                </span>

                <span className="share-date w110 text-center">
                  {share.expireInfinity
                    ? "永久有效"
                    : DateUtil.simpleDateHourMinute(share.expireTime)}
                </span>
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
                    <span className="text-danger">已过期</span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Expanding>
          {showMore ? (
            <div className="more-panel">
              <div className="cell-btn">
                <span>
                  分享时间: {DateUtil.simpleDateHourMinute(share.createTime)}
                </span>
                <span>
                  {share.expireInfinity
                    ? "永久有效"
                    : DateUtil.simpleDateHourMinute(share.expireTime)}
                </span>
              </div>

              <div
                className="cell-btn"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.showShare())
                }
              >
                <InfoCircleOutlined className="btn-action mr5" />
              </div>

              <div
                className="cell-btn"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.delShare())
                }
              >
                <DeleteOutlined className="btn-action red" />
              </div>
            </div>
          ) : null}
        </Expanding>
      </div>
    );
  }
}
