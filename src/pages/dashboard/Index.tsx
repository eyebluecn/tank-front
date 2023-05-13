import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Index.less';
import TankComponent from '../../common/component/TankComponent';
import TankTitle from '../widget/TankTitle';
import { Alert, Col, Row } from 'antd';
import RatePanel from './widget/RatePanel';
import ReactEcharts from 'echarts-for-react';
import Echarts from 'echarts';
import theme from './theme.json';
import Pager from '../../common/model/base/Pager';
import Dashboard from '../../common/model/dashboard/Dashboard';
import DateUtil from '../../common/util/DateUtil';
import SortDirection from '../../common/model/base/SortDirection';
import FileUtil from '../../common/util/FileUtil';
import Matter from '../../common/model/matter/Matter';
import Lang from '../../common/model/global/Lang';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';

Echarts.registerTheme('tank_theme', theme);

interface IProps extends RouteComponentProps {}

interface IState {}

interface IpStruct {
  ip: string;
  times: number;
}

export default class Index extends TankComponent<IProps, IState> {
  //获取分页的一个帮助器
  pager: Pager<Dashboard> = new Pager<Dashboard>(this, Dashboard, 15);

  //今天的统计情况
  dashboard: Dashboard = new Dashboard(this);
  yesterdayDashboard: Dashboard = new Dashboard(this);

  matterPager: Pager<Matter> = new Pager<Matter>(this, Matter, 10);

  activeIpTop10: IpStruct[] = [];

  //****************作图需要的对象******************/
  days: number = 15;
  //用来存放日期的，辅助x轴的生成
  dateStrings: string[] = [];

  //调用量周环比
  standardWeekInvokeNum: number = 0;
  compareWeekInvokeNum: number = 0;
  //调用量日环比
  standardDayInvokeNum: number = 0;
  compareDayInvokeNum: number = 0;
  //UV周环比
  standardWeekUv: number = 0;
  compareWeekUv: number = 0;
  //UV日环比
  standardDayUv: number = 0;
  compareDayUv: number = 0;
  //文件总数周环比
  standardWeekMatterNum: number = 0;
  compareWeekMatterNum: number = 0;
  //文件总数日环比
  standardDayMatterNum: number = 0;
  compareDayMatterNum: number = 0;
  //文件大小周环比
  standardWeekSize: number = 0;
  compareWeekSize: number = 0;
  //文件大小日环比
  standardDaySize: number = 0;
  compareDaySize: number = 0;

  invokeListOption: any = {
    tooltip: {},
    legend: {
      data: ['PV', 'UV'],
    },
    xAxis: {
      name: Lang.t('assign.date'),
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    },
    yAxis: {
      name: Lang.t('assign.num'),
    },
    series: [
      {
        name: 'PV',
        type: 'bar',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'UV',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    this.updateDateStrings();
    this.refreshDashboardPager();
    this.refreshMatterPager();
    this.refreshActiveIpTop10();
  }

  updateDateStrings() {
    let that = this;
    //更新横坐标 从今天开始倒推
    let arr = [];
    for (let d = that.days - 1; d >= 0; d--) {
      let thenDate = new Date(new Date().getTime() - d * 24 * 60 * 60 * 1000);
      arr.push(DateUtil.simpleDate(thenDate));
    }
    that.dateStrings = arr;
  }

  //获取15日调用分时数据
  refreshDashboardPager() {
    let that = this;

    this.pager.setFilterValue('orderDt', SortDirection.DESC);

    this.pager.httpList(function (response: any) {
      let list = that.pager.data;

      if (list.length > 0) {
        that.dashboard.assign(list[0]);
      }

      if (list.length > 1) {
        that.yesterdayDashboard.assign(list[1]);
      }

      //数据转换成map，方便检索
      let map: { [key: string]: Dashboard } = {};
      for (let i = 0; i < list.length; i++) {
        map[list[i].dt] = list[i];
      }

      let invokeNumData = [];
      let uvData = [];
      let matterNumData = [];
      let fileSizeData = [];
      for (let i = 0; i < that.days; i++) {
        invokeNumData.push(0);
        uvData.push(0);
        matterNumData.push(0);
        fileSizeData.push(0);
      }

      //按照日期对应。
      for (let i = 0; i < that.dateStrings.length; i++) {
        let item = map[that.dateStrings[i]];
        if (item) {
          invokeNumData[i] = item.invokeNum;
          uvData[i] = item.uv;
          matterNumData[i] = item.matterNum;
          fileSizeData[i] = item.fileSize;
        }
      }

      //同环比
      that.standardWeekInvokeNum = 0;
      that.compareWeekInvokeNum = 0;
      //调用量日环比
      that.standardDayInvokeNum = 0;
      that.compareDayInvokeNum = 0;
      //UV周环比
      that.standardWeekUv = 0;
      that.compareWeekUv = 0;
      //UV日环比
      that.standardDayUv = 0;
      that.compareDayUv = 0;

      //文件总数周环比
      that.standardWeekMatterNum = 0;
      that.compareWeekMatterNum = 0;
      //文件总数日环比
      that.standardDayMatterNum = 0;
      that.compareDayMatterNum = 0;
      //文件大小周环比
      that.standardWeekSize = 0;
      that.compareWeekSize = 0;
      //文件大小日环比
      that.standardDaySize = 0;
      that.compareDaySize = 0;

      for (let i = 0; i < that.days; i++) {
        if (i >= 0 && i <= 6) {
          that.standardWeekInvokeNum += invokeNumData[i];
          that.standardWeekUv += uvData[i];
          that.standardWeekMatterNum += matterNumData[i];
          that.standardWeekSize += fileSizeData[i];
        } else if (i >= 7 && i <= 13) {
          that.compareWeekInvokeNum += invokeNumData[i];
          that.compareWeekUv += uvData[i];
          that.compareWeekMatterNum += matterNumData[i];
          that.compareWeekSize += fileSizeData[i];
        }
        if (i === 12) {
          that.standardDayInvokeNum = invokeNumData[i];
          that.standardDayUv = uvData[i];
          that.standardDayMatterNum = matterNumData[i];
          that.standardDaySize = fileSizeData[i];
        }
        if (i === 13) {
          that.compareDayInvokeNum = invokeNumData[i];
          that.compareDayUv = uvData[i];
          that.compareDayMatterNum = matterNumData[i];
          that.compareDaySize = fileSizeData[i];
        }
      }

      that.invokeListOption.xAxis.data = that.dateStrings.map((k) =>
        k.substr(5)
      );
      that.invokeListOption.series[0].data = invokeNumData;
      that.invokeListOption.series[1].data = uvData;

      that.updateUI();
    });
  }

  //获取下载前10的文件
  refreshMatterPager() {
    let that = this;
    that.matterPager.setFilterValue('orderTimes', SortDirection.DESC);
    that.matterPager.httpList();
  }

  refreshActiveIpTop10() {
    let that = this;
    that.dashboard.httpActiveIpTop10(function (data: any) {
      if (data) {
        that.activeIpTop10 = data;
      }
      that.updateUI();
    });
  }

  reRun() {
    let that = this;
    that.dashboard.httpEtl(function (data: any) {
      MessageBoxUtil.success(Lang.t('operationSuccess'));

      that.refresh();
    });
  }

  onChartReady() {}

  render() {
    let that = this;

    let dashboard: Dashboard = this.dashboard;
    let yesterdayDashboard: Dashboard = this.yesterdayDashboard;

    return (
      <div className="page-dashboard-index">
        <TankTitle name={Lang.t('layout.dashboard')}></TankTitle>

        <Row gutter={18}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">
                  {Lang.t('dashboard.totalInvokeNum')}
                </div>
                <div className="amount">{dashboard.totalInvokeNum}</div>
                <div>
                  <RatePanel
                    name={Lang.t('dashboard.weekRate')}
                    standardValue={this.standardWeekInvokeNum}
                    compareValue={this.compareWeekInvokeNum}
                  />
                  <RatePanel
                    name={Lang.t('dashboard.dayRate')}
                    standardValue={this.standardDayInvokeNum}
                    compareValue={this.compareDayInvokeNum}
                  />
                </div>
              </div>
              <div className="lower">
                {Lang.t('dashboard.yesterdayInvoke')}:
                {yesterdayDashboard.invokeNum}
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">{Lang.t('dashboard.totalUV')}</div>
                <div className="amount">{dashboard.totalUv}</div>
                <div>
                  <RatePanel
                    name={Lang.t('dashboard.weekRate')}
                    standardValue={this.standardWeekUv}
                    compareValue={this.compareWeekUv}
                  />
                  <RatePanel
                    name={Lang.t('dashboard.dayRate')}
                    standardValue={this.standardDayUv}
                    compareValue={this.compareDayUv}
                  />
                </div>
              </div>
              <div className="lower">
                {Lang.t('dashboard.yesterdayUV')}:{yesterdayDashboard.uv}
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">
                  {Lang.t('dashboard.totalMatterNum')}
                </div>
                <div className="amount">{dashboard.totalMatterNum}</div>
                <div>
                  <RatePanel
                    name={Lang.t('dashboard.weekRate')}
                    standardValue={this.standardWeekMatterNum}
                    compareValue={this.compareWeekMatterNum}
                  />
                  <RatePanel
                    name={Lang.t('dashboard.dayRate')}
                    standardValue={this.standardDayMatterNum}
                    compareValue={this.compareDayMatterNum}
                  />
                </div>
              </div>
              <div className="lower">
                {Lang.t('dashboard.yesterdayMatterNum')}:
                {yesterdayDashboard.matterNum}
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">
                  {Lang.t('dashboard.totalFileSize')}
                </div>
                <div className="amount">
                  {FileUtil.humanFileSize(dashboard.totalFileSize)}
                </div>
                <div>
                  <RatePanel
                    name={Lang.t('dashboard.weekRate')}
                    standardValue={this.standardWeekSize}
                    compareValue={this.compareWeekSize}
                  />
                  <RatePanel
                    name={Lang.t('dashboard.dayRate')}
                    standardValue={this.standardDaySize}
                    compareValue={this.compareDaySize}
                  />
                </div>
              </div>
              <div className="lower">
                {Lang.t('dashboard.yesterdayMatterSize')}:
                {FileUtil.humanFileSize(yesterdayDashboard.fileSize)}
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <div className="figure-block">
              <div className="title">
                {Lang.t('dashboard.recentDayInvokeUV', 15)}
              </div>
              <figure>
                <ReactEcharts
                  option={that.invokeListOption}
                  notMerge={true}
                  lazyUpdate={false}
                  theme={'tank_theme'}
                  onChartReady={this.onChartReady.bind(this)}
                  showLoading={this.pager.loading}
                  opts={{ renderer: 'svg' }}
                />
              </figure>
            </div>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="figure-block">
              <div className="title">
                {Lang.t('dashboard.downloadMatterTop10')}
              </div>
              <div className="list-rank">
                <ul>
                  {this.matterPager.data.map(
                    (matter: Matter, index: number) => {
                      return (
                        <li key={index}>
                          <span className={`rank ${index < 3 ? 'top3' : ''}`}>
                            {index + 1}
                          </span>
                          <Link
                            className="name"
                            to={'/matter/detail/' + matter.uuid}
                          >
                            {matter.name}
                          </Link>
                          <span className="info">{matter.times}</span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="figure-block">
              <div className="title">{Lang.t('dashboard.activeIpTop10')}</div>
              <div className="list-rank">
                <ul>
                  {this.activeIpTop10.map((item: IpStruct, index: number) => {
                    return (
                      <li key={index}>
                        <span className={`rank ${index < 3 ? 'top3' : ''}`}>
                          {index + 1}
                        </span>
                        <span className="name">{item.ip}</span>
                        <span className="info">{item.times}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Col>
        </Row>

        <div>
          <Alert
            message={
              <span>
                {Lang.t('dashboard.warnHint')}
                <span className="link" onClick={this.reRun.bind(this)}>
                  {Lang.t('dashboard.reRun')}
                </span>
              </span>
            }
            type="warning"
          />
        </div>
      </div>
    );
  }
}
