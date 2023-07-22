import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import Moon from '../../../common/model/global/Moon';
import Matter from '../../../common/model/matter/Matter';
import ImagePreviewer from '../../widget/previewer/ImagePreviewer';
import { Button, Input, Upload } from 'antd';
import UploadMatterPanel from './UploadMatterPanel';
import './MatterImage.less';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import SafeUtil from '../../../common/util/SafeUtil';
import Lang from '../../../common/model/global/Lang';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

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

  changeLink(e: any) {
    SafeUtil.safeCallback(this.props.onChange)(e.target.value);
  }

  triggerUpload(fileObj: RcCustomRequestOptions) {
    const file = fileObj.file;
    const { filter = 'image', uploadHint = '' } = this.props;
    if (file) {
      let fileSize = (file as any).size;

      if (
        this.user.space!.sizeLimit >= 0 &&
        fileSize > this.user.space!.sizeLimit
      ) {
        MessageBoxUtil.error(
          Lang.t('matter.sizeExceedLimit', fileSize, this.user.space!.sizeLimit)
        );
        return;
      }
      this.matter.assign({
        uploadHint,
        filter,
        file,
        puuid: 'root',
        privacy: false,
        dir: false,
        alien: true,
        userUuid: this.user.uuid,
        spaceUuid: this.user.space.uuid,
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
  }

  toggleHandle() {
    this.manual = !this.manual;
    this.updateUI();
  }

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
              placeholder={Lang.t('matter.fillInPicLink')}
              value={value}
              onChange={(e) => this.changeLink(e)}
            />
          ) : (
            <Upload
              className="content"
              customRequest={(e) => this.triggerUpload(e)}
              showUploadList={false}
            >
              <Button className="wp100 border-short">
                {Lang.t('matter.chooseImage')}
              </Button>
            </Upload>
          )}
          <Button
            className="handle"
            type="primary"
            onClick={() => this.toggleHandle()}
          >
            {manual ? Lang.t('matter.uploadMode') : Lang.t('matter.fillMode')}
          </Button>
        </div>
        {uploadHint ? <div className="italic">{uploadHint}</div> : null}
        <UploadMatterPanel matter={matter} />
      </div>
    );
  }
}
