import React from "react";
import { Button, Modal, Pagination, Space } from "antd";
import Pager from "../../../../common/model/base/Pager";
import ImageCache from "../../../../common/model/image/cache/ImageCache";
import TankComponent from "../../../../common/component/TankComponent";
import ImageCachePanel from "./ImageCachePanel";
import ImagePreviewer from "../../../widget/previewer/ImagePreviewer";
import MessageBoxUtil from "../../../../common/util/MessageBoxUtil";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Empty } from "antd";
import TankTitle from "../../../widget/TankTitle";

interface IProps {
  initFilter: any;
}

interface IState {}

export default class ImageCacheList extends TankComponent<IProps, IState> {
  selectedImageCaches: ImageCache[] = [];
  pager = new Pager<ImageCache>(this, ImageCache, 2);

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.refresh();
  }

  deleteBatch = () => {
    Modal.confirm({
      title: "此操作不可撤回, 是否继续?",
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        const uuids = this.selectedImageCaches.map((i) => i.uuid).toString();
        const imageCache = new ImageCache();
        imageCache.httpDeleteBatch(uuids, () => {
          MessageBoxUtil.success("操作成功");
          this.refresh();
        });
      },
    });
  };

  checkBatch = (check: boolean) => {
    this.pager.data.forEach((i) => {
      i.check = check;
    });
    this.checkImageCache();
  };

  refresh = () => {
    const { initFilter } = this.props;
    if (initFilter) {
      for (let key in initFilter) {
        if (initFilter.hasOwnProperty(key)) {
          this.pager.setFilterValue(key, initFilter[key]);
        }
      }
    }
    this.pager.page = 0;
    this.pager.httpList();
    this.selectedImageCaches = [];
  };

  checkImageCache = (imageCache?: ImageCache) => {
    if (imageCache) {
      if (imageCache.check) {
        this.selectedImageCaches.push(imageCache);
      } else {
        const index = this.selectedImageCaches.findIndex(
          (item) => item.uuid === imageCache.uuid
        );
        this.selectedImageCaches.splice(index, 1);
      }
    } else {
      this.selectedImageCaches.splice(0, this.selectedImageCaches.length);
      this.pager.data.forEach((imageCache) => {
        if (imageCache.check) {
          this.selectedImageCaches.push(imageCache);
        }
      });
    }
    this.updateUI();
  };

  previewImageCache = (imageCache: ImageCache) => {
    //从matter开始预览图片
    const imageArray: string[] = [];
    let startIndex = -1;
    this.pager.data.forEach((item) => {
      imageArray.push(item.getResizeUrl());
      if (item.uuid === imageCache.uuid) {
        startIndex = imageArray.length - 1;
      }
    });

    ImagePreviewer.showMultiPhoto(imageArray, startIndex);
  };

  changePage = (page: number) => {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  };

  render() {
    const { selectedImageCaches, pager } = this;
    if (!pager.data.length) return <Empty description="暂无图片缓存数据"/>;
    return (
      <div>
        <TankTitle
          name={"图片缓存"}
          children={
            <div>
              <Space>
                {selectedImageCaches.length ? (
                  <Button type="primary" onClick={this.deleteBatch}>
                    删除
                  </Button>
                ) : null}
                {selectedImageCaches.length !== pager.data.length ? (
                  <Button type="primary" onClick={() => this.checkBatch(true)}>
                    全选
                  </Button>
                ) : null}
                {pager.data.length &&
                selectedImageCaches.length === pager.data.length ? (
                  <Button type="primary" onClick={() => this.checkBatch(false)}>
                    取消
                  </Button>
                ) : null}
              </Space>
            </div>
          }
        />

        {pager.data.map((imageCache) => (
          <ImageCachePanel
            key={imageCache.uuid!}
            imageCache={imageCache}
            onDeleteSuccess={this.refresh}
            onCheckImageCache={this.checkImageCache}
            onPreviewImageCache={this.previewImageCache}
          />
        ))}

        <Pagination
          className="mt10 pull-right"
          onChange={this.changePage}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />
      </div>
    );
  }
}
