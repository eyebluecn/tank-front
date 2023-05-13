import React from 'react';
import './PreviewConfigPanel.less';
import TankComponent from '../../../common/component/TankComponent';
import PreviewConfig from '../../../common/model/preference/model/PreviewConfig';
import PreviewEngine from '../../../common/model/preference/model/PreviewEngine';
import PreviewEngineEditCell from './PreviewEngineEditCell';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Lang from '../../../common/model/global/Lang';

interface IProps {
  previewConfig: PreviewConfig;
}

interface IState {}

export default class PreviewConfigPanel extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  addEngine() {
    let previewConfig: PreviewConfig = this.props.previewConfig;

    let engine: PreviewEngine = new PreviewEngine();

    previewConfig.previewEngines.push(engine);

    this.updateUI();
  }

  delEngineCell(index: number) {
    this.props.previewConfig.previewEngines.splice(index, 1);
    this.updateUI();
  }

  render() {
    const { previewConfig } = this.props;

    return (
      <div className="widget-preview-config-panel">
        {previewConfig.previewEngines.map(
          (previewEngine: PreviewEngine, index: number) => {
            return (
              <PreviewEngineEditCell
                key={index}
                previewEngine={previewEngine}
                index={index}
                onDelete={() => {
                  this.delEngineCell(index);
                }}
              />
            );
          }
        )}

        <Button
          type="dashed"
          block={true}
          icon={<PlusOutlined />}
          onClick={() => this.addEngine()}
        >
          {Lang.t('preference.newEngine')}
        </Button>
      </div>
    );
  }
}
