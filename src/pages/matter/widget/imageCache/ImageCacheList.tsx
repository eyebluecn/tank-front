import React from 'react';
import { Button, Empty, Modal, Pagination, Space } from 'antd';
import Pager from '../../../../common/model/base/Pager';
import ImageCache from '../../../../common/model/image/cache/ImageCache';
import TankComponent from '../../../../common/component/TankComponent';
import ImageCachePanel from './ImageCachePanel';
import ImagePreviewer from '../../../widget/previewer/ImagePreviewer';
import MessageBoxUtil from '../../../../common/util/MessageBoxUtil';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import TankTitle from '../../../widget/TankTitle';
import Lang from '../../../../common/model/global/Lang';
import TankContentCard from '../../../widget/TankContentCard';

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
    this.pager.enableHistory();
  }

  componentDidMount() {
    this.refresh();
  }

  deleteBatch() {
    Modal.confirm({
      title: Lang.t('actionCanNotRevertConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        const uuids = this.selectedImageCaches.map((i) => i.uuid).toString();
        const imageCache = new ImageCache();
        imageCache.httpDeleteBatch(uuids, () => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.refresh();
        });
      },
    });
  }

  checkBatch(check: boolean) {
    this.pager.data.forEach((i) => {
      i.check = check;
    });
    this.checkImageCache();
  }

  refresh() {
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
  }

  checkImageCache(imageCache?: ImageCache) {
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
  }

  previewImageCache(imageCache: ImageCache) {
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
  }

  changePage(page: number) {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  }

  render() {
    const { selectedImageCaches, pager } = this;
    if (!pager.data.length)
      return <Empty description={Lang.t('matter.noImageCache')} />;
    return (
      <div>
        <TankTitle
          name={Lang.t('matter.imageCache')}
          children={
            <div>
              <Space>
                {selectedImageCaches.length ? (
                  <Button type="primary" onClick={() => this.deleteBatch()}>
                    <DeleteOutlined />
                    {Lang.t('delete')}
                  </Button>
                ) : null}
                {selectedImageCaches.length !== pager.data.length ? (
                  <Button type="primary" onClick={() => this.checkBatch(true)}>
                    <PlusSquareOutlined />
                    {Lang.t('selectAll')}
                  </Button>
                ) : null}
                {pager.data.length &&
                selectedImageCaches.length === pager.data.length ? (
                  <Button type="primary" onClick={() => this.checkBatch(false)}>
                    <MinusSquareOutlined />
                    {Lang.t('cancel')}
                  </Button>
                ) : null}
              </Space>
            </div>
          }
        />

        <TankContentCard>
          {pager.data.map((imageCache) => (
            <ImageCachePanel
              key={imageCache.uuid!}
              imageCache={imageCache}
              onDeleteSuccess={() => this.refresh()}
              onCheckImageCache={(e) => this.checkImageCache(e)}
              onPreviewImageCache={(e) => this.previewImageCache(e)}
            />
          ))}
        </TankContentCard>

        <Pagination
          className="mt10 pull-right"
          onChange={(page) => this.changePage(page)}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />
      </div>
    );
  }
}
