import React from "react";
import copy from 'copy-to-clipboard';
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
  AppstoreFilled,
  ApiFilled,
  EditFilled,
  DownloadOutlined,
  DeleteFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Modal, Checkbox } from 'antd';
import {CheckboxChangeEvent} from "antd/es/checkbox";

interface IProps {
  matter: Matter;
  director: Director;
  onCreateDirectoryCallback?: () => any,
  onDeleteSuccess?: () => any,
  onCheckMatter?: () => any,
  onPreviewImage?: (matter: Matter) => any,
  onGoToDirectory?: (id: string) => any

}

interface IState {}

export default class MatterPanel extends TankComponent<IProps, IState> {
  //正在重命名的临时字段
  renameMatterName: string = "";
  //正在向服务器提交rename的请求
  renamingLoading:boolean = false;
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
    MessageBoxUtil.success('操作成功');
  };

  deleteMatter = () => {
    Modal.confirm({
      title: '此操作不可撤回, 是否继续?',
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00"/>,
      onOk: () => {
        this.props.matter.httpDelete(() => {
          MessageBoxUtil.success('操作成功');
          this.props.onDeleteSuccess!();
        })
      }
    });
  };

  changeMatterName = (e: any) => {
    this.renameMatterName = e.currentTarget.value;
    this.updateUI();
  };

  finishRename = () => {
    //有可能按enter的时候和blur同时了。
    if (this.renamingLoading) {
      return
    }
    const { matter, director } = this.props;
    this.renamingLoading = true;

    matter.httpRename(this.renameMatterName, () => {
      this.renamingLoading = false;
      MessageBoxUtil.success('操作成功');
      //告诉导演，自己编辑完毕
      director.renameMode = false;
      matter.editMode = false
    },(msg:string) => {
      this.renamingLoading = false;
      MessageBoxUtil.error(msg);
      //告诉导演，自己编辑完毕
      director.renameMode = false;
      matter.editMode = false;
    }, () => this.updateUI())
  };

  finishCreateDirectory = () => {
    const { matter, director, onCreateDirectoryCallback } = this.props;
    matter.name = this.renameMatterName;
    matter.httpCreateDirectory(() => {
      director.createMode = false;
      matter.editMode = false;
      matter.assign(new Matter());
    }, (msg: string) => {
      director.createMode = false;
      matter.editMode = false;
      MessageBoxUtil.error(msg)
    }, () =>
      onCreateDirectoryCallback!()
    );
  };

  blurTrigger = () => {
    const { matter, director } = this.props;
    if(matter.editMode) {
      if (director.createMode) {
        this.finishCreateDirectory()
      } else if (director.renameMode) {
        this.finishRename()
      }
    }
  };

  enterTrigger = (e: any) => {
    if(e.key.toLowerCase() === 'enter') {
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
    this.props.onCheckMatter!();
  };

  highLight = () => {
    this.inputRef.current!.select();
  };

  clickRow = () => {
    const { matter, director, onGoToDirectory, onPreviewImage } = this.props;
    if (director.isEditing()) {
      console.error('导演正忙着，不予执行');
      return
    }

    if (matter.dir) {
      onGoToDirectory!(matter.uuid!);
    } else {
      //图片进行预览操作
      if (matter.isImage()) {
        onPreviewImage!(matter);
      } else {
        matter.preview()
      }
    }
  };

  render() {
    const { matter } = this.props;
    return (
      <div className="widget-matter-panel">
        <div onClick={this.clickRow}>
          <div className="media">
            <div className="pull-left">
              <div className="left-part">
                <span className="basic-span">
                  <Checkbox checked={matter.check} onChange={this.checkToggle} />
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
                        onClick={() => this.changePrivacy(false)}
                      />
                    )}
                    {!matter.dir && !matter.privacy && (
                      <LockFilled
                        className="btn-action blue"
                        onClick={() => this.changePrivacy(true)}
                      />
                    )}
                    <AppstoreFilled
                      className="btn-action blue"
                      onClick={() =>
                        Sun.navigateTo("/matter/detail/" + matter.uuid)
                      }
                    />
                    <EditFilled
                      className="btn-action blue"
                      onClick={this.prepareRename.bind(this)}
                    />
                    <ApiFilled
                      className="btn-action blue"
                      onClick={this.clipboard.bind(this)}
                    />
                    <DownloadOutlined
                      className="btn-action blue"
                      onClick={() => matter.download()}
                    />
                    <DeleteFilled
                      className="btn-action red"
                      onClick={this.deleteMatter.bind(this)}
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

            {/*todo 在小屏幕下的操作栏*/}

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
      </div>
    );
  }
}
