import React from 'react';
import './CreateTablePanel.less';
import {Button, Spin, Tag} from 'antd';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";
import Color from "../../../common/model/base/option/Color";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  FormatPainterOutlined,
  SyncOutlined
} from "@ant-design/icons/lib";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";

interface IProps {

  install: Install
  onPreStep: () => void
  onNextStep: () => void
}

interface IState {

}

export default class CreateTablePanel extends TankComponent<IProps, IState> {

  loading: boolean = true

  createTableLoading: boolean = false

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

    this.fetchTableInfoList()

  }

  fetchTableInfoList() {

    let that = this
    let install: Install = this.props.install

    this.loading = true
    this.updateUI()

    install.httpTableInfoList(null, null, function () {
      that.loading = false
      that.updateUI()
    })
  }

  createTable() {
    //开始建表
    let that = this;
    let install: Install = this.props.install

    that.createTableLoading = true
    that.updateUI()

    install.httpCreateTable(function () {
      MessageBoxUtil.success("建表成功!")
    }, null, function () {

      that.createTableLoading = false
      that.updateUI()
    })
  }

  goToPrevious() {
    let that = this

    this.props.onPreStep()

  }

  goToNext() {
    let that = this
    let install: Install = this.props.install

    if (install.tableCreated()) {

      this.props.onNextStep()

    } else {
      MessageBoxUtil.error("请首先完成建表")
    }

  }

  render() {

    let that = this;

    let install: Install = this.props.install

    let tableCreated: boolean = install.tableCreated()

    return (
      <div className="widget-create-panel">

        <Spin spinning={that.loading}>
          {
            install.tableInfoList.map(function (tableInfo: any, index: number) {

              return (
                <div className="install-block" key={index}>
                  <div className="f16">
                    {tableInfo.name}

                    {
                      (tableInfo.tableExist && tableInfo.missingFields.length === 0) && (
                        <Tag className="mh5" color={Color.SUCCESS}>已安装</Tag>
                      )
                    }

                    {
                      (tableInfo.tableExist && tableInfo.missingFields.length > 0) && (
                        <Tag className="mh5" color={Color.DANGER}>已安装,字段缺失</Tag>
                      )
                    }

                    {
                      !tableInfo.tableExist && (
                        <Tag className="mh5" color={Color.WARNING}>待安装</Tag>
                      )
                    }
                  </div>

                  <div className="mt10">
                    所有字段:
                    {
                      tableInfo.allFields.map(function (field: any, j: number) {

                        return (
                          <Tag className="mh5 mv5" key={j}>
                            {field.DBName}
                          </Tag>
                        )
                      })
                    }
                  </div>


                  {
                    (tableInfo.tableExist && tableInfo.missingFields.length > 0) && (
                      <div className="mt10">
                        缺失字段:
                        {
                          tableInfo.missingFields.map(function (field: any, j: number) {

                            return (
                              <Tag className="mh5 mv5" key={j}>
                                {field.DBName}
                              </Tag>
                            )
                          })
                        }
                      </div>
                    )
                  }

                </div>
              )

            })
          }

          <div className="text-right mt15">
            <Button className={'ml10'} type={"default"}
                    icon={<SyncOutlined/>}
                    onClick={this.fetchTableInfoList.bind(this)}
            >
              刷新
            </Button>

            <Button className={'ml10'} type={tableCreated ? "primary" : "default"}
                    icon={tableCreated ? <CheckOutlined/> : <FormatPainterOutlined/>}
                    onClick={this.createTable.bind(this)}
                    disabled={tableCreated}
                    loading={this.createTableLoading}
            >
              {tableCreated ? '已完成建表' : '一键建表'}
            </Button>

            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowLeftOutlined/>}
                    onClick={this.goToPrevious.bind(this)}>
              上一步
            </Button>
            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowRightOutlined/>}
                    onClick={this.goToNext.bind(this)}>
              下一步
            </Button>
          </div>

        </Spin>


      </div>
    );
  }
}


