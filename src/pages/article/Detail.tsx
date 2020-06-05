import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Detail.less';
import BambooComponent from '../../common/component/BambooComponent';
import Article from '../../common/model/article/Article';
import { Button, Col, Row, Spin } from 'antd';
import InfoCell from '../widget/InfoCell';
import StringUtil from '../../common/util/StringUtil';
import BambooTitle from '../widget/BambooTitle';

interface RouteParam {
  uuid: string
}

interface IProps extends RouteComponentProps<RouteParam> {

}

interface IState {
}

export default class Detail extends BambooComponent<IProps, IState> {

  article: Article = new Article(this);

  constructor(props: IProps) {
    super(props);


    this.state = {};

    //article的id设置晚了就来不及了
    let match = this.props.match;
    if (match.params.uuid) {
      this.article.uuid = match.params.uuid;
    }

  }


  componentDidMount() {
    //刷新一下列表
    let that = this;

    let match = this.props.match;
    let article = that.article;

    article.httpDetail(function() {

    });

  }


  render() {

    let that = this;
    let article: Article = that.article;
    //router中传入的路由相关对象
    let match = this.props.match;


    return (
      <div className="article-detail">

        <BambooTitle name={'文章详情'}>
          <Link title="编辑"
                to={StringUtil.prePath(match.path, 2) + '/edit/' + article.uuid}>
            <Button className="mh10" type="primary" icon="edit">
              编辑
            </Button>
          </Link>
        </BambooTitle>

        <Spin tip="加载中" spinning={article.detailLoading}>

          <div className="info">

            {/*<Row>*/}
            {/*  <Col span={12}>*/}
            {/*    <InfoCell name="文章名称">*/}
            {/*      {article.title}*/}
            {/*    </InfoCell>*/}
            {/*  </Col>*/}
            {/*  <Col span={12}>*/}
            {/*    <InfoCell name="作者">*/}
            {/*      {article.author}*/}
            {/*    </InfoCell>*/}
            {/*  </Col>*/}
            {/*  <Col span={12}>*/}
            {/*    <InfoCell name="路径">*/}
            {/*      {article.path}*/}
            {/*    </InfoCell>*/}
            {/*  </Col>*/}


            {/*</Row>*/}

            <div className="article" dangerouslySetInnerHTML={{__html: ''+ article.html}} />

          </div>


        </Spin>

      </div>
    );
  }
}


