import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import Matter from '../../../common/model/matter/Matter';
import StringUtil from '../../../common/util/StringUtil';
import { Progress, Button, Space, Tooltip } from 'antd';
import {
  CloseOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  CloudUploadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import './UploadMatterPanel.less';
import Lang from '../../../common/model/global/Lang';
import { UploadSessionStatus } from '../../../common/model/chunk/ChunkUploader';

interface IProps {
  matter: Matter;
}

interface IState {}

export default class UploadMatterPanel extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  format(percent: number) {
    return `${percent.toFixed(1)}%`;
  }

  componentDidMount() {
    this.props.matter.reactComponent = this;
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {}

  componentWillUnmount() {
    this.props.matter.reactComponent = null;
  }

  // Get status text based on upload status
  getStatusText(matter: Matter): string {
    if (!matter.useChunkedUpload) {
      if (matter.progress < 1) {
        return '';
      }
      return Lang.t('matter.finishingTip');
    }

    switch (matter.uploadStatus) {
      case UploadSessionStatus.UPLOADING:
        return `${matter.uploadedChunks}/${matter.totalChunks} ${Lang.t(
          'matter.chunks'
        )}`;
      case UploadSessionStatus.MERGING:
        return Lang.t('matter.mergingChunks');
      case UploadSessionStatus.PAUSED:
        return Lang.t('matter.paused');
      case UploadSessionStatus.COMPLETED:
        return Lang.t('matter.completed');
      case UploadSessionStatus.ERROR:
        return Lang.t('matter.uploadFailed');
      case UploadSessionStatus.CANCELLED:
        return Lang.t('matter.cancelled');
      default:
        return '';
    }
  }

  // Get progress bar status
  getProgressStatus(
    matter: Matter
  ): 'active' | 'success' | 'exception' | 'normal' {
    if (!matter.useChunkedUpload) {
      return 'active';
    }

    switch (matter.uploadStatus) {
      case UploadSessionStatus.UPLOADING:
        return 'active';
      case UploadSessionStatus.MERGING:
        return 'active';
      case UploadSessionStatus.PAUSED:
        return 'normal';
      case UploadSessionStatus.COMPLETED:
        return 'success';
      case UploadSessionStatus.ERROR:
        return 'exception';
      case UploadSessionStatus.CANCELLED:
        return 'exception';
      default:
        return 'active';
    }
  }

  // Get progress bar color
  getStrokeColor(matter: Matter): any {
    if (!matter.useChunkedUpload) {
      return {
        from: '#108ee9',
        to: '#87d068',
      };
    }

    switch (matter.uploadStatus) {
      case UploadSessionStatus.PAUSED:
        return {
          from: '#faad14',
          to: '#faad14',
        };
      case UploadSessionStatus.ERROR:
      case UploadSessionStatus.CANCELLED:
        return {
          from: '#ff4d4f',
          to: '#ff4d4f',
        };
      default:
        return {
          from: '#108ee9',
          to: '#87d068',
        };
    }
  }

  render() {
    const { matter } = this.props;
    const statusText = this.getStatusText(matter);
    const progressStatus = this.getProgressStatus(matter);
    const strokeColor = this.getStrokeColor(matter);

    return (
      <div className="upload-matter-panel">
        {matter.loading ? (
          <div className="huge-block clearfix">
            <div className="media">
              <div className="media-body">
                <span className="filename">{matter.file!.name}</span>
              </div>
              <div className="media-actions">
                <Space>
                  {/* Pause/Resume button for chunked upload */}
                  {matter.canPause() && (
                    <Tooltip title={Lang.t('matter.pause')}>
                      <PauseCircleOutlined
                        className="action-icon"
                        onClick={() => matter.pauseUpload()}
                      />
                    </Tooltip>
                  )}
                  {matter.canResume() && (
                    <Tooltip title={Lang.t('matter.resume')}>
                      <PlayCircleOutlined
                        className="action-icon resume-icon"
                        onClick={() => matter.resumeUpload()}
                      />
                    </Tooltip>
                  )}
                  {/* Cancel button */}
                  <Tooltip title={Lang.t('matter.cancel')}>
                    <CloseOutlined
                      className="action-icon cancel-icon"
                      onClick={() => matter.cancelUpload()}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>
            <Progress
              className="progress"
              strokeColor={strokeColor}
              format={() => this.format(matter.progress * 100)}
              percent={matter.progress * 100}
              status={progressStatus}
            />
            <div className="upload-info">
              <span className="uploaded-size">
                {`${Lang.t('matter.uploaded')}: ${StringUtil.humanFileSize(
                  matter.file!.size * matter.progress
                )}/${StringUtil.humanFileSize(matter.file!.size)}`}
              </span>
              {matter.progress < 1 &&
                matter.uploadStatus === UploadSessionStatus.UPLOADING && (
                  <span className="upload-speed">
                    {` ${Lang.t('matter.speed')}: ${StringUtil.humanFileSize(
                      matter.speed
                    )}/s`}
                  </span>
                )}
              {statusText && (
                <span className="status-text">{` - ${statusText}`}</span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
