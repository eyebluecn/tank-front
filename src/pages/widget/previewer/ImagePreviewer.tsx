import React from 'react';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import ReactDOM from 'react-dom';
import { OverlayRenderProps } from 'react-photo-view/dist/types';
import {
  CloseOutlined,
  DownloadOutlined,
  RotateRightOutlined,
} from '@ant-design/icons';
import TankComponent from '../../../common/component/TankComponent';
import { Space } from 'antd';
import './ImagePreviewer.less';

/**
 * 图片预览器
 * 支持预览一张图片或者多张图片
 * 参考文档：https://zhuanlan.zhihu.com/p/473554342
 * https://gitee.com/MinJieLiu/react-photo-view
 */
export default class ImagePreviewer extends TankComponent<any, any> {
  static initialized: boolean = false;

  static singletonRef = React.createRef<ImagePreviewer>();

  //组件的私有变量
  visible: boolean = true;
  urls: string[] = [];
  index: number = 0;

  //初始化
  private static init() {
    let div: HTMLElement = document.createElement('div');
    div.id = 'photo-container';

    //添加到body
    document.body.appendChild(div);

    ReactDOM.render(
      <ImagePreviewer ref={ImagePreviewer.singletonRef} />,
      document.getElementById('photo-container')
    );
  }

  //展示一张图片
  static showSinglePhoto(url: string) {
    ImagePreviewer.showMultiPhoto([url], 0);
  }

  //展示一系列图片
  static showMultiPhoto(urls: string[], index: number = 0) {
    if (!ImagePreviewer.initialized) {
      ImagePreviewer.initialized = true;
      ImagePreviewer.init();
    }

    ImagePreviewer.singletonRef.current?.show(urls, index);
  }

  show(urls: string[], index: number = 0) {
    this.urls = urls;
    this.index = index;
    this.visible = true;
    this.updateUI();
  }

  render() {
    let toolBar: (overlayProps: OverlayRenderProps) => React.ReactNode = (
      overlayProps: OverlayRenderProps
    ) => {
      return (
        <Space>
          <DownloadOutlined
            className="f18 toolbar-icon btn-action"
            onClick={() => {
              const a = document.createElement('a');
              a.setAttribute('download', '');
              a.setAttribute('target', '_blank');
              a.setAttribute('rel', 'noopener');
              a.href = overlayProps.images[overlayProps.index].src!;
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
          />
          <RotateRightOutlined
            className="f18 toolbar-icon btn-action"
            onClick={() => {
              overlayProps.onRotate(overlayProps.rotate + 90);
            }}
          />
          <CloseOutlined
            className="f18 toolbar-icon btn-action"
            onClick={() => overlayProps.onClose()}
          />
        </Space>
      );
    };

    return (
      <PhotoSlider
        className="widget-image-previewer"
        images={this.urls.map((item: string) => ({ src: item, key: item }))}
        visible={this.visible}
        onClose={() => {
          this.visible = false;
          this.updateUI();
        }}
        index={this.index}
        onIndexChange={(index: number) => {
          this.index = index;
          this.updateUI();
        }}
        toolbarRender={toolBar}
      />
    );
  }
}
