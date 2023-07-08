import React from 'react';
import { Breadcrumb } from 'antd';
import './TableEmpty.less';
import TankComponent from '../../common/component/TankComponent';
import BreadcrumbModel from '../../common/model/base/option/BreadcrumbModel';
import Sun from '../../common/model/global/Sun';

interface IProps {
  breadcrumbModels: BreadcrumbModel[];
}

interface IState {}

export default class BreadcrumbPanel extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Breadcrumb>
        {this.props.breadcrumbModels.map(
          (item: BreadcrumbModel, index: number) => {
            if (item.displayDirect) {
              return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>;
            } else {
              return (
                <Breadcrumb.Item key={index}>
                  <span
                    className="cursor"
                    onClick={
                      item.onClick
                        ? item.onClick
                        : () => {
                            Sun.navigateQueryTo({
                              path: item.path,
                              query: item.query,
                            });
                          }
                    }
                  >
                    {item.name}
                  </span>
                </Breadcrumb.Item>
              );
            }
          }
        )}
      </Breadcrumb>
    );
  }
}
