import PhotoSwipeLayout from "./PhotoSwipeLayout";
import Vue from 'vue'
import PhotoSwipe from 'x-photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'x-photoswipe/dist/photoswipe-ui-default'
//PhotoSwipe的样式
import "x-photoswipe/dist/photoswipe.css";
import "x-photoswipe/dist/default-skin/default-skin.css";

/**
 *
 * 图片预览控件，主要提供给H5端使用。
 */
export default class PhotoSwipeHelper {

  constructor() {

    //核心
    this.photoSwipe = null;

    //小本本记住，动态创建Vue组件。
    let ComponentClass = Vue.extend(PhotoSwipeLayout)
    this.vueInstance = new ComponentClass()

    this.init()
  }

  //初始化工作一口气做完
  init() {
    //挂载组件，非常重要。否则$el就不会出现。
    this.vueInstance.$mount()
    document.body.appendChild(this.vueInstance.$el)
  }


  //展示一张图片
  showSinglePhoto(url, width = 0, height = 0) {

    let that = this;
    let items = [{
      src: url,
      w: width,
      h: height
    }];

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
      index: 0
    };
    this.photoSwipe = new PhotoSwipe(this.vueInstance.$el, PhotoSwipeUIDefault, items, options);

    this.photoSwipe.listen('gettingData', function (index, item) {
      if (!item.w || !item.h || item.w < 1 || item.h < 1) {
        const img = new Image()
        img.onload = function () {
          item.w = this.width
          item.h = this.height
          that.photoSwipe.updateSize(true)
        }
        img.src = item.src
      }
    })
    this.photoSwipe.init();

    this.photoSwipe.listen('close', () => {
      console.log("photoSwipe事件：close")
    })
    this.photoSwipe.listen('afterChange', (a, b) => {
      console.log("photoSwipe事件：afterChange")
    })
  }

  //展示一系列图片
  showMultiPhoto(urls = [], index = 0) {

    let that = this;
    let items = [];
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
    this.photoSwipe = new PhotoSwipe(this.vueInstance.$el, PhotoSwipeUIDefault, items, options);

    this.photoSwipe.listen('gettingData', function (index, item) {
      if (!item.w || !item.h || item.w < 1 || item.h < 1) {
        const img = new Image()
        img.onload = function () {
          item.w = this.width
          item.h = this.height
          that.photoSwipe.updateSize(true)
        }
        img.src = item.src
      }
    })
    this.photoSwipe.init();

    this.photoSwipe.listen('close', () => {
      //photoSwipe事件：close
    })
    this.photoSwipe.listen('afterChange', (a, b) => {
      //photoSwipe事件：afterChange
    })
  }

  //单例，为了只有一个实例
  static singleton = null;

  //使用懒加载
  static getSingleton() {
    if (!PhotoSwipeHelper.singleton) {
      PhotoSwipeHelper.singleton = new PhotoSwipeHelper();
    }
    return PhotoSwipeHelper.singleton;
  }

  //展示一张图片。
  static showPhoto(url) {
    PhotoSwipeHelper.getSingleton().showSinglePhoto(url);
  }


  //展示一系列图片
  static showPhotos(urls, index = 0) {
    PhotoSwipeHelper.getSingleton().showMultiPhoto(urls, index);
  }

}

