import React from 'react';
import "./PreviewEngineCell.less"
import TankComponent from "../../../common/component/TankComponent";
import PreviewEngine from "../../../common/model/preference/model/PreviewEngine";

interface IProps {

  previewEngine: PreviewEngine

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

        URL: {previewEngine.url}
        extension: {previewEngine.extensions}

      </div>

    )
  }
}

