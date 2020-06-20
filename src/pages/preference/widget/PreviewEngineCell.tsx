import React from 'react';
import "./PreviewEngineCell.less"
import TankComponent from "../../../common/component/TankComponent";
import PreviewEngine from "../../../common/model/preference/model/PreviewEngine";
import {DeleteOutlined} from '@ant-design/icons';
import {Input, Form} from "antd";
import InfoCell from "../../widget/InfoCell";

interface IProps {

  previewEngine: PreviewEngine
  index: number
  onDelete: () => void

}

interface IState {

}

export default class PreviewEngineCell extends TankComponent <IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }


  render() {

    let that = this
    let previewEngine: PreviewEngine = this.props.previewEngine

    return (
      <div className="widget-preview-engine-cell">
        <div className="engine-title">
          <span>{this.props.index + 1}号预览引擎</span>
          <span>
            <DeleteOutlined className="btn-action text-danger" onClick={() => {
              this.props.onDelete()
            }}/>
          </span>
        </div>
        <div className="engine-content">

          <Form.Item label="Warning" hasFeedback validateStatus="warning">
            <Input.Password placeholder="with input password" />
          </Form.Item>

          <InfoCell name={"URL"} firstSpan={4}>
            <Input value={previewEngine.url} onChange={(e) => {
              previewEngine.url = e.target.value
              this.updateUI()
            }}/>
          </InfoCell>
          <InfoCell name={"后缀"} firstSpan={4}>
            <Input value={previewEngine.extensions} onChange={(e) => {
              previewEngine.extensions = e.target.value
              this.updateUI()
            }}/>
          </InfoCell>

        </div>

      </div>

    )
  }
}

