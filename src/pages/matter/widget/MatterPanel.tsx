import React from "react";
import copy from "copy-to-clipboard";
import { CSSTransition } from "react-transition-group";
import Matter from "../../../common/model/matter/Matter";
import TankComponent from "../../../common/component/TankComponent";
import Director from "./Director";
import "./MatterPanel.less";
import Sun from "../../../common/model/global/Sun";
import StringUtil from "../../../common/util/StringUtil";
import DateUtil from "../../../common/util/DateUtil";
import AnimateUtil from "../../../common/util/AnimateUtil";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";
import {
  LockFilled,
  UnlockFilled,
  DownloadOutlined,
  ExclamationCircleFilled,
  SmallDashOutlined,
  LinkOutlined,
  DeleteOutlined,
  InfoCircleTwoTone,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Modal, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import SafeUtil from "../../../common/util/SafeUtil";

interface IProps {
  matter: Matter;
  director: Director;
  onCreateDirectoryCallback?: () => any;
  onDeleteSuccess?: () => any;
  onCheckMatter?: (matter?: Matter) => any;
  onPreviewImage?: (matter: Matter) => any;
  onGoToDirectory?: (id: string) => any;
}

interface IState {}

export default class MatterPanel extends TankComponent<IProps, IState> {
  // 正在重命名的临时字段
  renameMatterName: string = "";
  // 正在向服务器提交rename的请求
  renamingLoading: boolean = false;
  // 小屏幕下操作栏
  showMore: boolean = false;

  inputRef = React.createRef<HTMLInputElement>();

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  prepareRename = () => {
    const { matter, director } = this.props;
    if (director.isEditing()) {
      console.error("导演正忙着，不予执行");
      return;
    }

    //告诉导演，自己正在编辑
    director.renameMode = true;
    matter.editMode = true;
    this.renameMatterName = matter.name!;
    this.updateUI();
    setTimeout(() => {
      if (!this.inputRef.current) return;
      //如果是文件夹，全选中
      let dotIndex = matter.name!.lastIndexOf(".");
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
  };

  clipboard = () => {
    let textToCopy = this.props.matter.getDownloadUrl();
    copy(textToCopy);
    MessageBoxUtil.success("操作成功");
  };

  deleteMatter = () => {
    Modal.confirm({
      title: "此操作不可撤回, 是否继续?",
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.props.matter.httpDelete(() => {
          MessageBoxUtil.success("操作成功");
          this.props.onDeleteSuccess!();
        });
      },
    });
  };

  changeMatterName = (e: any) => {
    this.renameMatterName = e.currentTarget.value;
    this.updateUI();
  };

  finishRename = () => {
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
        MessageBoxUtil.success("操作成功");
        //告诉导演，自己编辑完毕
        director.renameMode = false;
        matter.editMode = false;
      },
      (msg: string) => {
        this.renamingLoading = false;
        MessageBoxUtil.error(msg);
        //告诉导演，自己编辑完毕
        director.renameMode = false;
        matter.editMode = false;
      },
      () => this.updateUI()
    );
  };

  finishCreateDirectory = () => {
    const { matter, director, onCreateDirectoryCallback } = this.props;
    matter.name = this.renameMatterName;
    matter.httpCreateDirectory(
      () => {
        director.createMode = false;
        matter.editMode = false;
        matter.assign(new Matter());
      },
      (msg: string) => {
        director.createMode = false;
        matter.editMode = false;
        MessageBoxUtil.error(msg);
      },
      () => onCreateDirectoryCallback!()
    );
  };

  blurTrigger = () => {
    const { matter, director } = this.props;
    if (matter.editMode) {
      if (director.createMode) {
        this.finishCreateDirectory();
      } else if (director.renameMode) {
        this.finishRename();
      }
    }
  };

  enterTrigger = (e: any) => {
    if (e.key.toLowerCase() === "enter") {
      this.inputRef.current!.blur();
    }
  };

  changePrivacy = (privacy: boolean) => {
    this.props.matter.httpChangePrivacy(privacy, () => {
      this.updateUI();
    });
  };

  checkToggle = (e: CheckboxChangeEvent) => {
    this.props.matter.check = e.target.checked;
    this.props.onCheckMatter!(this.props.matter);
  };

  highLight = () => {
    this.inputRef.current!.select();
  };

  clickRow = () => {
    const { matter, director, onGoToDirectory, onPreviewImage } = this.props;
    if (director.isEditing()) {
      console.error("导演正忙着，不予执行");
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
  };

  toggleHandles = () => {
    this.showMore = !this.showMore;
    this.updateUI();
  };

  render() {
    console.log(this.showMore);
    const { matter } = this.props;
    return (
      <div className="widget-matter-panel">
        <div onClick={(e) => SafeUtil.stopPropagationWrap(e)(this.clickRow())}>
          <div className="media">
            <div className="pull-left">
              <div className="left-part">
                <span className="basic-span basic-span-hot">
                  <Checkbox
                    onClick={(e) => SafeUtil.stopPropagationWrap(e)}
                    checked={matter.check}
                    onChange={this.checkToggle}
                  />
                </span>
                <span className="basic-span">
                  <img className="matter-icon" src={matter.getIcon()} />
                </span>
              </div>
            </div>

            {/*在大屏幕下的操作栏*/}
            <div className="pull-right visible-pc">
              {matter.uuid && (
                <div className="right-part">
                  <span className="matter-operation">
                    {!matter.dir && matter.privacy && (
                      <UnlockFilled
                        className="btn-action blue"
                        onClick={(e) =>
                          SafeUtil.stopPropagationWrap(e)(
                            this.changePrivacy(false)
                          )
                        }
                      />
                    )}
                    {!matter.dir && !matter.privacy && (
                      <LockFilled
                        className="btn-action blue"
                        onClick={(e) =>
                          SafeUtil.stopPropagationWrap(e)(
                            this.changePrivacy(true)
                          )
                        }
                      />
                    )}
                    <InfoCircleTwoTone
                      className="btn-action blue"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(
                          Sun.navigateTo("/matter/detail/" + matter.uuid)
                        )
                      }
                    />
                    <EditOutlined
                      className="btn-action blue"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(this.prepareRename())
                      }
                    />
                    <LinkOutlined
                      className="btn-action blue"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(this.clipboard())
                      }
                    />
                    <DownloadOutlined
                      className="btn-action blue"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(matter.download())
                      }
                    />
                    <DeleteOutlined
                      className="btn-action red"
                      onClick={(e) =>
                        SafeUtil.stopPropagationWrap(e)(this.deleteMatter())
                      }
                    />
                  </span>
                  <span className="matter-size">
                    {StringUtil.humanFileSize(matter.size)}
                  </span>
                  <span className="matter-date">
                    {DateUtil.simpleDateHourMinute(matter.updateTime)}
                  </span>
                </div>
              )}
            </div>

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
                {matter.editMode ? (
                  <span className="matter-name-edit">
                    <input
                      ref={this.inputRef}
                      className={matter.uuid!}
                      value={this.renameMatterName}
                      onChange={this.changeMatterName.bind(this)}
                      placeholder="请输入名称"
                      onBlur={this.blurTrigger.bind(this)}
                      onKeyUp={this.enterTrigger.bind(this)}
                    />
                  </span>
                ) : (
                  <span className="matter-name">
                    {matter.name}
                    {!matter.dir && !matter.privacy && (
                      <UnlockFilled className="icon" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <CSSTransition in={this.showMore} timeout={200} classNames="drop">
          <div className="visible-mobile more-panel">
            <div className="cell-btn navy">
              <span>{DateUtil.simpleDateHourMinute(matter.updateTime)}</span>
              <span className="matter-size">
                {StringUtil.humanFileSize(matter.size)}
              </span>
            </div>

            {!matter.dir && matter.privacy && (
              <div
                className="cell-btn navy"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.changePrivacy(false))
                }
              >
                <UnlockFilled className="btn-action mr5" />
                设置为公有文件
              </div>
            )}

            {!matter.dir && !matter.privacy && (
              <div
                className="cell-btn navy"
                onClick={(e) =>
                  SafeUtil.stopPropagationWrap(e)(this.changePrivacy(true))
                }
              >
                <LockFilled className="btn-action mr5" />
                设置为私有文件
              </div>
            )}

            <div
              className="cell-btn navy"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(
                  Sun.navigateTo("/matter/detail/" + matter.uuid)
                )
              }
            >
              <InfoCircleOutlined className="btn-action mr5" />
              文件详情
            </div>
            <div
              className="cell-btn navy"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(this.prepareRename())
              }
            >
              <EditOutlined className="btn-action mr5" />
              重命名
            </div>
            <div
              className="cell-btn navy"
              onClick={(e) => SafeUtil.stopPropagationWrap(e)(this.clipboard())}
            >
              <LinkOutlined className="btn-action mr5" />
              复制下载链接
            </div>
            <div
              className="cell-btn navy"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(matter.download())
              }
            >
              <DownloadOutlined className="btn-action mr5" />
              下载
            </div>
            <div
              className="cell-btn red"
              onClick={(e) =>
                SafeUtil.stopPropagationWrap(e)(this.deleteMatter())
              }
            >
              <DeleteOutlined className="btn-action mr5" />
              删除
            </div>
          </div>
        </CSSTransition>
      </div>
    );
  }
}
