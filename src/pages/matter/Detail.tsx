import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Detail.less';
import TankComponent from '../../common/component/TankComponent';
import Matter from '../../common/model/matter/Matter';
import { Button, Col, Row, Spin } from 'antd';
import InfoCell from '../widget/InfoCell';
import StringUtil from '../../common/util/StringUtil';
import TankTitle from '../widget/TankTitle';

interface RouteParam {
  uuid: string
}

interface IProps extends RouteComponentProps<RouteParam> {

}

interface IState {
}

export default class Detail extends TankComponent<IProps, IState> {

  matter: Matter = new Matter(this);

  constructor(props: IProps) {
    super(props);


    this.state = {};

    //matter的id设置晚了就来不及了
    let match = this.props.match;
    if (match.params.uuid) {
      this.matter.uuid = match.params.uuid;
    }

  }


  componentDidMount() {
    //刷新一下列表
    let that = this;

    let match = this.props.match;
    let matter = that.matter;

    matter.httpDetail(function() {

    });

  }


  render() {

    let that = this;
    let matter: Matter = that.matter;
    //router中传入的路由相关对象
    let match = this.props.match;


    return (
      <div className="matter-detail">

        <TankTitle name={'文件详情'}>
          <Link title="编辑"
                to={StringUtil.prePath(match.path, 2) + '/edit/' + matter.uuid}>
            <Button className="mh10" type="primary">
              编辑
            </Button>
          </Link>
        </TankTitle>

        <Spin tip="加载中" spinning={matter.detailLoading}>

          <div className="info">



          </div>


        </Spin>

      </div>
    );
  }
}


