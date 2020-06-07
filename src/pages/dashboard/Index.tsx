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


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Index extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  preference: Preference = Moon.getSingleton().preference

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {


  }

  render() {

    let that = this

    return (
      <div className="page-dashboard-index">

        <TankTitle name={'监控统计'}>
        </TankTitle>

        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
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

      </div>
    );
  }
}


