import React from 'react';
import "./PreviewConfigPanel.less"
import TankComponent from "../../../common/component/TankComponent";
import PreviewConfig from "../../../common/model/preference/model/PreviewConfig";
import PreviewEngine from "../../../common/model/preference/model/PreviewEngine";
import PreviewEngineCell from "./PreviewEngineCell";
import {Button} from "antd";
import {PlusOutlined} from '@ant-design/icons';

interface IProps {

  previewConfig: PreviewConfig

}

interface IState {

}

export default class PreviewConfigPanel extends TankComponent <IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  addEngine() {

    let previewConfig: PreviewConfig = this.props.previewConfig

    let engine: PreviewEngine = new PreviewEngine()

    previewConfig.previewEngines.push(engine)

    this.updateUI()

  }

  render() {

    let that = this

    let previewConfig: PreviewConfig = this.props.previewConfig

    return (

      <div className="widget-preview-config-panel">

        {previewConfig.previewEngines.map((previewEngine: PreviewEngine, index: number) => {
          return <PreviewEngineCell key={index} previewEngine={previewEngine}/>
        })}

        <Button type="dashed" block={true} icon={<PlusOutlined/>} onClick={this.addEngine.bind(this)}>
          添加一个预览引擎
        </Button>

      </div>

    )
  }
}

