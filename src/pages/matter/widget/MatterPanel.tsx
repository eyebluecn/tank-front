import React from 'react';
import Matter from '../../../common/model/matter/Matter';
import TankComponent from '../../../common/component/TankComponent';
import Director from './Director';
import './MatterPanel.less';
import StringUtil from '../../../common/util/StringUtil';
import DateUtil from '../../../common/util/DateUtil';
import AnimateUtil from '../../../common/util/AnimateUtil';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import Expanding from '../../widget/Expanding';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Checkbox, Dropdown, Menu, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import SafeUtil from '../../../common/util/SafeUtil';
import ClipboardUtil from '../../../common/util/ClipboardUtil';
import Lang from '../../../common/model/global/Lang';
import MatterDeleteModal from './MatterDeleteModal';
import { SpaceMemberRole } from '../../../common/model/space/member/SpaceMemberRole';

interface IProps {
  matter: Matter;
  mode: 'normal' | 'space'; // normal:正常模式，space:空间模式
  spaceMemberRole?: SpaceMemberRole; // 用户在当前空间下的角色,只有在space模式下才有值
  director?: Director;
  onCreateDirectoryCallback?: () => any;
  onDeleteSuccess?: () => any;
  onCheckMatter?: (matter?: Matter) => any;
  onPreviewImage?: (matter: Matter) => any;
  onGoToDirectory?: (id: string) => any;
  onGoDetail?: (matter: Matter) => any;
}

interface IState {}

export default class MatterPanel extends TankComponent<IProps, IState> {
  // 正在重命名的临时字段
  renameMatterName: string = '';
  // 正在向服务器提交rename的请求
  renamingLoading: boolean = false;
  // 小屏幕下操作栏
  showMore: boolean = false;

  inputRef = React.createRef<HTMLInputElement>();

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  // 如果在空间下，有些操作权限只对管理员和读写成员开放
  checkHandlePermission() {
    if (this.props.mode !== 'space') return true;
    return [SpaceMemberRole.ADMIN, SpaceMemberRole.READ_WRITE].includes(
      this.props.spaceMemberRole!
    );
  }

  prepareRename() {
    const { matter, director } = this.props;
    if (director!.isEditing()) {
      console.error('导演正忙着，不予执行');
      return;
    }

    //告诉导演，自己正在编辑
    director!.renameMode = true;
    matter.editMode = true;
    this.renameMatterName = matter.name!;
    this.updateUI();
    setTimeout(() => {
      if (!this.inputRef.current) return;
      //如果是文件夹，全选中
      let dotIndex = matter.name!.lastIndexOf('.');
      if (dotIndex === -1) {
        AnimateUtil.setInputSelection(
          this.inputRef.current,
          0,
          this.renameMatterName.length
        );
      } else {
        AnimateUtil.setInputSelection(this.inputRef.current, 0, dotIndex);
      }
    });
  }

  clipboard() {
    let textToCopy = this.props.matter.getDownloadUrl();
    ClipboardUtil.copy(textToCopy, () => {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
    });
  }

  deleteMatter() {
    MatterDeleteModal.open(
      () => {
        this.props.matter.httpSoftDelete(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.props.onDeleteSuccess!();
        });
      },
      () => {
        this.props.matter.httpDelete(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.props.onDeleteSuccess!();
        });
      }
    );
  }

  changeMatterName(e: any) {
    this.renameMatterName = e.currentTarget.value;
    this.updateUI();
  }

  finishRename() {
    //有可能按enter的时候和blur同时了。
    if (this.renamingLoading) {
      return;
    }
    const { matter, director } = this.props;
    this.renamingLoading = true;

    matter.httpRename(
      this.renameMatterName,
      () => {
        this.renamingLoading = false;
        MessageBoxUtil.success(Lang.t('operationSuccess'));
        //告诉导演，自己编辑完毕
        director!.renameMode = false;
        matter.editMode = false;
      },
      (msg: string) => {
        this.renamingLoading = false;
        MessageBoxUtil.error(msg);
        //告诉导演，自己编辑完毕
        director!.renameMode = false;
        matter.editMode = false;
      },
      () => this.updateUI()
    );
  }

  finishCreateDirectory() {
    const { matter, director, onCreateDirectoryCallback } = this.props;
    matter.name = this.renameMatterName;
    matter.httpCreateDirectory(
      () => {
        director!.createMode = false;
        matter.editMode = false;
        matter.assign(new Matter());
      },
      (msg: string) => {
        director!.createMode = false;
        matter.editMode = false;
        MessageBoxUtil.error(msg);
      },
      () => onCreateDirectoryCallback!()
    );
  }

  blurTrigger() {
    const { matter, director } = this.props;
    if (matter.editMode) {
      if (director!.createMode) {
        this.finishCreateDirectory();
      } else if (director!.renameMode) {
        this.finishRename();
      }
    }
  }

  enterTrigger(e: any) {
    if (e.key.toLowerCase() === 'enter') {
      this.inputRef.current!.blur();
    }
  }

  changePrivacy(privacy: boolean) {
    this.props.matter.httpChangePrivacy(privacy, () => {
      this.updateUI();
    });
  }

  checkToggle(e: CheckboxChangeEvent) {
    this.props.matter.check = e.target.checked;
    this.props.onCheckMatter!(this.props.matter);
  }

  highLight() {
    this.inputRef.current!.select();
  }

  clickRow() {
    const { matter, director, onGoToDirectory, onPreviewImage, mode } =
      this.props;
    if (director && director.isEditing()) {
      console.error('导演正忙着，不予执行');
      return;
    }

    if (matter.dir) {
      onGoToDirectory!(matter.uuid!);
    } else {
      //图片进行预览操作
      if (matter.isImage()) {
        onPreviewImage!(matter);
      } else {
        matter.preview();
      }
    }
  }

  toggleHandles() {
    this.showMore = !this.showMore;
    this.updateUI();
  }

  renderPcOperation() {
    const { matter } = this.props;

    return (
      <div className="right-part">
        <span className="matter-operation text-theme">
          {this.checkHandlePermission() && (
            <>
              {!matter.dir && matter.privacy && (
                <Tooltip title={Lang.t('matter.setPublic')}>
                  <UnlockOutlined
                    className="btn-action"
                    onClick={(e) =>
                      SafeUtil.stopPropagationWrap(e)(this.changePrivacy(false))
                    }
                  />
                </Tooltip>
              )}
              {!matter.dir && !matter.privacy && (
                <Tooltip title={Lang.t('matter.setPrivate')}>
                  <LockOutlined
                    className="btn-action"
                    onClick={(e) =>
                      SafeUtil.stopPropagationWrap(e)(this.changePrivacy(true))
                    }
                  />
                </Tooltip>
              )}
            </>
          )}

          <Tooltip title={Lang.t('matter.fileDetail')}>
            <InfoCircleOutlined
              className="btn-action"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(this.props.onGoDetail?.(matter))
              }
            />
          </Tooltip>
          {this.checkHandlePermission() && (
            <Tooltip title={Lang.t('matter.rename')}>
              <EditOutlined
                className="btn-action"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.prepareRename())
                }
              />
            </Tooltip>
          )}
          {/*文件夹不支持复制路径 安全问题*/}
          {!matter.dir && (
            <Tooltip title={Lang.t('matter.copyPath')}>
              <LinkOutlined
                className="btn-action"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.clipboard())
                }
              />
            </Tooltip>
          )}
          <Tooltip title={Lang.t('matter.download')}>
            <DownloadOutlined
              className="btn-action"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(matter.download())
              }
            />
          </Tooltip>
          {this.checkHandlePermission() && (
            <Tooltip title={Lang.t('matter.delete')}>
              <DeleteOutlined
                className="btn-action text-danger"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.deleteMatter())
                }
              />
            </Tooltip>
          )}
        </span>
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
    );
  }

  getHandles() {
    const { matter } = this.props;

    // 普通模式
    const handles = [
      <div
        className="cell-btn navy"
        onClick={(e) =>
          SafeUtil.stopPropagationWrap(e)(this.props.onGoDetail?.(matter))
        }
      >
        <InfoCircleOutlined className="btn-action mr5" />
        {Lang.t('matter.fileDetail')}
      </div>,
      ...(this.checkHandlePermission()
        ? [
            <div
              className="cell-btn navy"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(this.prepareRename())
              }
            >
              <EditOutlined className="btn-action mr5" />
              {Lang.t('matter.rename')}
            </div>,
          ]
        : []),
      ...(matter.dir
        ? []
        : [
            <div
              className="cell-btn navy"
              onClick={(e) => SafeUtil.stopPropagationWrap(e)(this.clipboard())}
            >
              <LinkOutlined className="btn-action mr5" />
              {Lang.t('matter.copyLink')}
            </div>,
          ]),
      <div
        className="cell-btn navy"
        onClick={(e) => SafeUtil.stopPropagationWrap(e)(matter.download())}
      >
        <DownloadOutlined className="btn-action mr5" />
        {Lang.t('matter.download')}
      </div>,
      ...(this.checkHandlePermission()
        ? [
            <div
              className="cell-btn text-danger"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(this.deleteMatter())
              }
            >
              <DeleteOutlined className="btn-action mr5" />
              {Lang.t('matter.delete')}
            </div>,
          ]
        : []),
    ];
    if (this.checkHandlePermission() && !matter.dir) {
      handles.unshift(
        matter.privacy ? (
          <div
            className="cell-btn navy"
            onClick={(e) =>
              SafeUtil.stopPropagationWrap(e)(this.changePrivacy(false))
            }
          >
            <UnlockOutlined className="btn-action mr5" />
            {Lang.t('matter.setPublic')}
          </div>
        ) : (
          <div
            className="cell-btn navy"
            onClick={(e) =>
              SafeUtil.stopPropagationWrap(e)(this.changePrivacy(true))
            }
          >
            <LockOutlined className="btn-action mr5" />
            {Lang.t('matter.setPrivate')}
          </div>
        )
      );
    }

    return handles;
  }

  renderMobileOperation() {
    const { matter } = this.props;

    return (
      <div className="more-panel">
        <div className="cell-btn navy text">
          <span>{DateUtil.simpleDateHourMinute(matter.updateTime)}</span>
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
                  {matter.editMode ? (
                    <span className="matter-name-edit">
                      <input
                        ref={this.inputRef}
                        className={matter.uuid!}
                        value={this.renameMatterName}
                        onChange={(e) => this.changeMatterName(e)}
                        placeholder={Lang.t('matter.enterName')}
                        onBlur={() => this.blurTrigger()}
                        onKeyUp={(e) => this.enterTrigger(e)}
                      />
                    </span>
                  ) : (
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
                  )}
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
