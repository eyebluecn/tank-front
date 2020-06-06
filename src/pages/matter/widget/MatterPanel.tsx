import React from "react";
import Matter from "../../../common/model/matter/Matter";
import TankComponent from "../../../common/component/TankComponent";
import Director from "./Director";
import "./MatterPanel.less";
import Sun from "../../../common/model/global/Sun";
import StringUtil from "../../../common/util/StringUtil";
import DateUtil from "../../../common/util/DateUtil";
import AnimateUtil from "../../../common/util/AnimateUtil";
import {
  LockFilled,
  UnlockFilled,
  AppstoreFilled,
  ApiFilled,
  EditFilled,
  DownloadOutlined,
  DeleteFilled,
} from "@ant-design/icons";

interface IProps {
  matter: Matter;
  director: Director;
}

interface IState {}

export default class MatterPanel extends TankComponent<IProps, IState> {
  //正在重命名的临时字段
  renameMatterName: string = "";

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

  clipboard = () => {};

  deleteMatter = () => {};

  blurTrigger = () => {};
  enterTrigger = () => {};

  changePrivacy = (privacy: boolean) => {
    this.props.matter.httpChangePrivacy(privacy, () => {
      this.updateUI();
    });
  };

  render() {
    const { matter } = this.props;
    return (
      <div className="widget-matter-panel">
        <div>
          <div className="media">
            <div className="pull-left">
              <div className="left-part">
                <span className="basic-span">
                  {/*todo checkbox <NbCheckbox v-model="matter.check"/>*/}
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
                      placeholder=""
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
