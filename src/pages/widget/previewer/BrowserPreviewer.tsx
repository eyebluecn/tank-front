import './BrowserPreviewer.less';
import React from 'react';
import * as ReactDOM from 'react-dom';
import FileUtil from '../../../common/util/FileUtil';
import { CloseOutlined } from '@ant-design/icons';

interface IProps {
  name: string;
  url: string;
  size: number;
  onClose: () => void;
}

interface IState {}

/**
 * 浏览器预览器
 * 浏览器支持的预览格式统统交由它处理
 */
export default class BrowserPreviewer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  //展示一系列图片
  static show(name: string, url: string, size: number) {
    let that = this;

    const div: Element = document.createElement('div');
    document.body.appendChild(div);

    let element: React.ReactElement = React.createElement(BrowserPreviewer, {
      name: name,
      url: url,
      size: size,
      onClose: () => {
        //删除所有节点。
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
          div.parentNode.removeChild(div);
        }
      },
    });

    //将react组件挂载到div中去。
    ReactDOM.render(element, div);
  }

  render() {
    return (
      <div
        className="browser-previewer-wrapper"
        onClick={() => this.props.onClose()}
      >
        <div className="browser-previewer" onClick={(e) => e.stopPropagation()}>
          <div className="title-bar">
            <div className="left-part"></div>

            <div className="middle-part">
              {this.props.name}({FileUtil.humanFileSize(this.props.size)})
            </div>

            <div className="right-part">
              <span className="close btn-action">
                <CloseOutlined
                  onClick={() => {
                    this.props.onClose();
                  }}
                />
              </span>
            </div>
          </div>
          <div className="frame-area">
            <iframe width="100%" height="100%" src={this.props.url}>
              iframe may not supported.
            </iframe>
          </div>
        </div>
      </div>
    );
  }
}
