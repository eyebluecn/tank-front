import React from 'react';
import "./PreviewEngineCell.less"
import TankComponent from "../../../common/component/TankComponent";
import PreviewEngine from "../../../common/model/preference/model/PreviewEngine";
import {DeleteOutlined} from '@ant-design/icons';
import {Form, Input} from "antd";

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

          <Form.Item
            label={"URL"}
            validateStatus={previewEngine.url ? undefined : 'error'}
            help={previewEngine.url ? undefined : "url不能为空，{matterUrl}表示文件路径，预览时会自动替换成对应的文件url"}
          >
            <Input value={previewEngine.url}
                   placeholder="请输入url，{matterUrl}表示注入的文件url路径"
                   onChange={(e) => {
                     previewEngine.url = e.target.value
                     this.updateUI()
                   }}/>
          </Form.Item>

          <Form.Item
            label={"后缀"}
            validateStatus={previewEngine.extensions ? undefined : 'error'}
            help={previewEngine.extensions ? undefined : "后缀不能为空，使用逗号分隔，不用带. 例如：doc,ppt,xls"}
          >
            <Input value={previewEngine.extensions}
                   placeholder="请输入后缀，使用逗号分隔，不用带. 例如：doc,ppt,xls"
                   onChange={(e) => {
                     previewEngine.extensions = e.target.value
                     this.updateUI()
                   }}/>
          </Form.Item>

        </div>

      </div>

    )
  }
}

