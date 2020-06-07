import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Index.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import Preference from "../../common/model/preference/Preference";
import {Col, Row} from 'antd';
import RatePanel from "./widget/RatePanel";
import ReactEcharts from 'echarts-for-react';
import Echarts from 'echarts';
import theme from "./theme.json"

Echarts.registerTheme('tank_theme', theme);

interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Index extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  preference: Preference = Moon.getSingleton().preference

  cntOption: any = {
    tooltip: {},
    legend: {
      data: ['PV', 'UV']
    },
    xAxis: {
      name: "日期",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    yAxis: {
      name: "数量"
    },
    series: [{
      name: 'PV',
      type: 'bar',
      data: [0, 0, 110, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0, 0]
    }, {
      name: 'UV',
      type: 'line',
      data: [0, 0, 0, 0, 220, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0]
    }]
  };

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {


  }

  onChartReady() {

  }

  render() {

    let that = this

    return (
      <div className="page-dashboard-index">

        <TankTitle name={'监控统计'}>
        </TankTitle>

        <Row gutter={18}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">总PV</div>
                <div className="amount">30052</div>
                <div>
                  <RatePanel name="周环比" standardValue={1000}
                             compareValue={800}/>
                  <RatePanel name="日环比" standardValue={2000}
                             compareValue={3400}/>
                </div>
              </div>
              <div className="lower">
                昨日PV:6928
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">总UV</div>
                <div className="amount">643</div>
                <div>
                  <RatePanel name="周环比" standardValue={1000}
                             compareValue={800}/>
                  <RatePanel name="日环比" standardValue={2000}
                             compareValue={3400}/>
                </div>
              </div>
              <div className="lower">
                昨日UV:6928
              </div>
            </div>
          </Col>


          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">总文件数</div>
                <div className="amount">10101</div>
                <div>
                  <RatePanel name="周环比" standardValue={1000}
                             compareValue={800}/>
                  <RatePanel name="日环比" standardValue={2000}
                             compareValue={3400}/>
                </div>
              </div>
              <div className="lower">
                昨日文件数:6928
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="text-block">
              <div className="upper">
                <div className="indicator">文件总大小</div>
                <div className="amount">14.5 GB</div>
                <div>
                  <RatePanel name="周环比" standardValue={1000}
                             compareValue={800}/>
                  <RatePanel name="日环比" standardValue={2000}
                             compareValue={3400}/>
                </div>
              </div>
              <div className="lower">
                昨日文件大小:6928
              </div>
            </div>
          </Col>

        </Row>

        <Row>
          <Col span={24}>

            <div className="figure-block">
              <div className="title">
                最近15日PV/UV
              </div>
              <figure>
                <ReactEcharts
                  option={that.cntOption}
                  notMerge={true}
                  lazyUpdate={false}
                  theme={"tank_theme"}
                  onChartReady={this.onChartReady.bind(this)}
                  showLoading={false}
                  opts={{renderer: "svg"}}/>
              </figure>
            </div>


          </Col>
        </Row>

      </div>
    );
  }
}


