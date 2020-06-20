import React from "react";
import TankComponent from "../../../common/component/TankComponent";
import Moon from "../../../common/model/global/Moon";
import Matter from "../../../common/model/matter/Matter";
import ImagePreviewer from "../../widget/previewer/ImagePreviewer";
import { Input, Upload, Button } from "antd";
import UploadMatterPanel from "./UploadMatterPanel";
import "./MatterImage.less";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";
import SafeUtil from "../../../common/util/SafeUtil";

interface IProps {
  value?: string;
  onChange?: (value: string) => any;
  preview?: boolean; //上传的照片是否需要预览
  previewWidth?: number;
  filter?: string;
  uploadHint?: string;
}

interface IState {}

export default class MatterImage extends TankComponent<IProps, IState> {
  // 是否手动上传模式
  manual = false;
  matter = new Matter(this);
  user = Moon.getSingleton().user;

  constructor(props: IProps) {
    super(props);
  }

  changeLink = (e: any) => {
    SafeUtil.safeCallback(this.props.onChange)(e.target.value);
  };

  triggerUpload = (fileObj: any) => {
    const { file } = fileObj;
    const { filter = "image", uploadHint = "" } = this.props;
    if (file) {
      if (this.user.sizeLimit >= 0 && file.size > this.user.sizeLimit) {
        MessageBoxUtil.error("文件大小超过了限制");
        return;
      }
      this.matter.assign({
        uploadHint,
        filter,
        file,
        puuid: "root",
        privacy: false,
        dir: false,
        alien: true,
        userUuid: this.user.uuid,
      });
      this.matter.httpUpload(
        () => {
          SafeUtil.safeCallback(this.props.onChange)(
            this.matter.getPreviewUrl()
          );
          this.matter = new Matter();
          this.updateUI();
        },
        () => this.updateUI()
      );
    }
  };

  toggleHandle = () => {
    this.manual = !this.manual;
    this.updateUI();
  };

  render() {
    const { manual, matter } = this;
    const {
      value,
      preview = true,
      previewWidth = 200,
      uploadHint,
    } = this.props;

    return (
      <div className="matter-image">
        <div className="tiny-block">
          {preview && value ? (
            <img
              className="p10 mb10 bg-white br5 border"
              style={{ width: `${previewWidth}px` }}
              src={value}
              onClick={() => ImagePreviewer.showSinglePhoto(value)}
            />
          ) : null}
        </div>
        <div className="composite-box">
          {manual ? (
            <Input
              className="content"
              placeholder="请填写图片链接"
              value={value}
              onChange={this.changeLink}
            />
          ) : (
            <Upload
              className="content"
              customRequest={this.triggerUpload}
              showUploadList={false}
            >
              <Button className="wp100 border-short">选择图片</Button>
            </Upload>
          )}
          <Button className="handle" type="primary" onClick={this.toggleHandle}>
            {manual ? "上传模式" : "填写模式"}
          </Button>
        </div>
        {uploadHint ? <div className="italic">{uploadHint}</div> : null}
        <UploadMatterPanel matter={matter} />
      </div>
    );
  }
}
