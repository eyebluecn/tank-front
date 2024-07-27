import React from 'react';
import Matter from '../../../common/model/matter/Matter';
import TankComponent from '../../../common/component/TankComponent';
import '../../matter/widget/MatterPanel.less';
import StringUtil from '../../../common/util/StringUtil';
import DateUtil from '../../../common/util/DateUtil';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import Expanding from '../../widget/Expanding';
import {
  CloseCircleOutlined,
  EllipsisOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
  RedoOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Checkbox, Dropdown, Menu, Modal, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import SafeUtil from '../../../common/util/SafeUtil';
import Lang from '../../../common/model/global/Lang';
import { SpaceMemberRole } from '../../../common/model/space/member/SpaceMemberRole';

interface IProps {
  matter: Matter;
  mode: 'normal' | 'space'; // normal:正常模式，space:空间模式
  spaceMemberRole?: SpaceMemberRole; // 用户在当前空间下的角色,只有在space模式下才有值
  onDeleteSuccess: () => any;
  onRecoverySuccess: () => any;
  onCheckMatter: (matter?: Matter) => any;
  onPreviewImage: (matter: Matter) => any;
  onGoDetail: (matter: Matter) => any;
}

interface IState {}

export default class BinMatterPanel extends TankComponent<IProps, IState> {
  // 小屏幕下操作栏
  showMore: boolean = false;

  hardDeleteMatter() {
    Modal.confirm({
      title: Lang.t('actionCanNotRevertConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.props.matter.httpDelete(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.props.onDeleteSuccess!();
        });
      },
    });
  }

  recoveryMatter() {
    Modal.confirm({
      title: Lang.t('actionRecoveryConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.props.matter.httpRecovery(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.props.onRecoverySuccess!();
        });
      },
    });
  }

  checkToggle(e: CheckboxChangeEvent) {
    this.props.matter.check = e.target.checked;
    this.props.onCheckMatter!(this.props.matter);
  }

  clickRow() {
    const { matter, onPreviewImage } = this.props;

    if (matter.dir) return;

    //图片进行预览操作
    if (matter.isImage()) {
      onPreviewImage!(matter);
    } else {
      matter.preview();
    }
  }

  toggleHandles() {
    this.showMore = !this.showMore;
    this.updateUI();
  }

  // 如果在空间下，有些操作权限只对管理员和读写成员开放
  checkHandlePermission() {
    if (this.props.mode === 'normal') return true;
    return [SpaceMemberRole.ADMIN, SpaceMemberRole.READ_WRITE].includes(
      this.props.spaceMemberRole!
    );
  }

  renderPcOperation() {
    const { matter } = this.props;

    return (
      <div className="right-part">
        <span className="matter-operation text-theme">
          <Tooltip title={Lang.t('matter.fileDetail')}>
            <InfoCircleOutlined
              className="btn-action"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(
                  this.props.onGoDetail(this.props.matter)
                )
              }
            />
          </Tooltip>
          {this.checkHandlePermission() && (
            <>
              <Tooltip title={Lang.t('matter.recovery')}>
                <RedoOutlined
                  className="btn-action"
                  onClick={(e) =>
                    SafeUtil.stopPropagationWrap(e)(this.recoveryMatter())
                  }
                />
              </Tooltip>
              <Tooltip title={Lang.t('matter.hardDelete')}>
                <CloseCircleOutlined
                  className="btn-action text-danger"
                  onClick={(e) =>
                    SafeUtil.stopPropagationWrap(e)(this.hardDeleteMatter())
                  }
                />
              </Tooltip>
            </>
          )}
        </span>
        <Tooltip title={Lang.t('matter.size')}>
          <span className="matter-size">
            {StringUtil.humanFileSize(matter.size)}
          </span>
        </Tooltip>
        <Tooltip title={Lang.t('matter.deleteTime')}>
          <span className="matter-date mr10">
            {DateUtil.simpleDateHourMinute(matter.deleteTime)}
          </span>
        </Tooltip>
      </div>
    );
  }

  getHandles() {
    const handles = [
      <div
        className="cell-btn navy"
        onClick={(e) =>
          SafeUtil.stopPropagationWrap(e)(
            this.props.onGoDetail(this.props.matter)
          )
        }
      >
        <InfoCircleOutlined className="btn-action mr5" />
        {Lang.t('matter.fileDetail')}
      </div>,
    ];
    if (this.checkHandlePermission()) {
      handles.push(
        <div
          className="cell-btn navy"
          onClick={(e) =>
            SafeUtil.stopPropagationWrap(e)(this.recoveryMatter())
          }
        >
          <RedoOutlined className="btn-action mr5" />
          {Lang.t('matter.recovery')}
        </div>,
        <div
          className="cell-btn text-danger"
          onClick={(e) =>
            SafeUtil.stopPropagationWrap(e)(this.hardDeleteMatter())
          }
        >
          <CloseCircleOutlined className="btn-action mr5" />
          {Lang.t('matter.hardDelete')}
        </div>
      );
    }

    return handles;
  }

  renderMobileOperation() {
    const { matter } = this.props;

    return (
      <div className="more-panel">
        <div className="cell-btn navy text">
          <span>{DateUtil.simpleDateHourMinute(matter.deleteTime)}</span>
          <span className="matter-size">
            {StringUtil.humanFileSize(matter.size)}
          </span>
        </div>
        {this.getHandles()}
      </div>
    );
  }

  render() {
    const { matter } = this.props;

    const menu = (
      <Menu>
        {this.getHandles().map((item, i) => (
          <Menu.Item key={i}>{item}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div className="widget-matter-panel">
          <div
            onClick={(e) => SafeUtil.stopPropagationWrap(e)(this.clickRow())}
          >
            <div className="media clearfix">
              <div className="pull-left">
                <div className="left-part">
                  <span
                    className="cell cell-hot"
                    onClick={(e) => SafeUtil.stopPropagationWrap(e)}
                  >
                    <Checkbox
                      checked={matter.check}
                      onChange={(e) => this.checkToggle(e)}
                    />
                  </span>
                  <span className="cell">
                    <img className="matter-icon" src={matter.getIcon()} />
                  </span>
                </div>
              </div>

              {/*在大屏幕下的操作栏*/}
              <div className="pull-right visible-pc">
                {matter.uuid && this.renderPcOperation()}
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
            {this.showMore ? this.renderMobileOperation() : null}
          </Expanding>
        </div>
      </Dropdown>
    );
  }
}
