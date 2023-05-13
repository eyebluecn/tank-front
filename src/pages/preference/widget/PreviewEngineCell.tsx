import './PreviewEngineCell.less';
import React from 'react';
import PreviewEngine from '../../../common/model/preference/model/PreviewEngine';
import { Tag, Tooltip } from 'antd';
import Lang from '../../../common/model/global/Lang';
import InfoCell from '../../widget/InfoCell';

interface IProps {
  engine: PreviewEngine;
  order?: number; // 从1开始
}

export default function PreviewEngineCell(props: IProps) {
  const { engine, order } = props;

  return (
    <div className="preview-engine-cell">
      <div className="engine-box">
        <p className="title">
          {order
            ? Lang.t('preference.previewEngine', order)
            : Lang.t('preference.defaultPreview')}
        </p>
        <InfoCell name={Lang.t('preference.engineReg')}>
          {engine.url === '{originUrl}' ? '{url}' : engine.url}
        </InfoCell>
        <InfoCell name={Lang.t('preference.engineSuffix')}>
          {engine.extensions}
        </InfoCell>
      </div>
      <div className="tip-box">
        {order ? null : (
          <Tooltip title={Lang.t('preference.defaultPreviewDesc')}>
            <Tag className="tip mr10" color="success">
              {Lang.t('preference.defaultPreview')}
            </Tag>
          </Tooltip>
        )}
        <Tooltip title={Lang.t('preference.enginePreview')}>
          {engine.previewInSite ? (
            <Tag className="tip mr0" color="purple">
              {Lang.t('preference.previewCurrent')}
            </Tag>
          ) : (
            <Tag className="tip mr0" color="purple">
              {Lang.t('preference.previewOpen')}
            </Tag>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
