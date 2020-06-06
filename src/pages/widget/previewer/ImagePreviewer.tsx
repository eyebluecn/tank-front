import React from 'react';
import "./ImagePreviewer.less"
import TankComponent from "../../../common/component/TankComponent";
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
//PhotoSwipe的样式
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";

interface IProps {
}

interface IState {
}

export default class ImagePreviewer extends TankComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  static pswpDom(): HTMLElement {
    let innerHTML = `
    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

        <!-- Container that holds slides.
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">

            <div class="pswp__top-bar">

                <!--  Controls are self-explanatory. Order can be changed. -->

                <div class="pswp__counter"></div>

                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                <button class="pswp__button pswp__button--share" title="Share"></button>

                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
                <!-- element will get class pswp__preloader--active when preloader is running -->
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>

            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>

            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>

        </div>

    </div>

    `

    let div: HTMLElement = document.createElement('div');
    div.className = "pswp";
    div.setAttribute("tabIndex", "-1")
    div.setAttribute("role", "dialog")
    div.setAttribute("aria-hidden", "true")

    div.innerHTML = innerHTML

    return div
  }

  //展示一张图片
  static showSinglePhoto(url: string) {

    ImagePreviewer.showMultiPhoto([url], 0)

  }

  //展示一系列图片
  static showMultiPhoto(urls: string[], index: number = 0) {

    let that = this;
    let items: PhotoSwipe.Item[] = [];
    urls.forEach((url) => {
      items.push({
        src: url,
        w: 0,
        h: 0
      })
    })

    let options = {
      //不需要历史纪录
      history: false,
      //不需要全屏按钮
      fullscreenEl: false,
      //不需要分享按钮
      shareEl: false,
      //点击不要让控制按钮消失
      tapToToggleControls: false,
      //当前从第0张展示。
      index: index
    };

    //获取dom节点
    let div = ImagePreviewer.pswpDom()
    //添加到body
    document.body.appendChild(div);

    let photoSwipe = new PhotoSwipe(div, PhotoSwipeUIDefault, items, options);

    photoSwipe.listen('gettingData', function (index, item) {

      if (!item.w || !item.h || item.w < 1 || item.h < 1) {

        //这里为了获取图片真实大小
        const img: HTMLImageElement = new Image()
        img.onload = function () {
          item.w = img.width
          item.h = img.height
          photoSwipe.updateSize(true); // reinit Items
        }
        img.src = item.src!
      }
    })
    photoSwipe.init();

    photoSwipe.listen('close', () => {
      if (div.parentNode) {
        //移除节点
        div.parentNode.removeChild(div);
      }
    })
    photoSwipe.listen('afterChange', () => {

    })

  }


  render() {

    let that = this

    return (
      <div className="widget-image-previewer">

      </div>
    );
  }
}

