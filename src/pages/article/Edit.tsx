import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, DatePicker, Input, message as MessageBox, Row, Spin } from 'antd';
import BambooComponent from '../../common/component/BambooComponent';
import Article from '../../common/model/article/Article';
import StringUtil from '../../common/util/StringUtil';
import './Edit.less';
import BambooTitle from '../widget/BambooTitle';

const { MonthPicker, RangePicker } = DatePicker;


interface RouteParam {
  uuid: string
}


interface IProps {

}

interface IState {
}

class RawEdit extends BambooComponent<IProps, IState> {

  createMode: boolean = true;
  article: Article = new Article(this);

  constructor(props: IProps) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

    //刷新一下列表

    let article = this.article;


  }


  //获取上一级目录
  getPrePath() {

    return ""

  }

  //返回到列表页面
  goToIndex() {

  }

  render() {

    let that = this;

    //router中传入的路由相关对象
    let article = this.article;




    return (
      <div className="article-edit">

        <BambooTitle name={this.createMode ? '创建文章' : '编辑文章'}>

        </BambooTitle>

      </div>
    );
  }
}

export default RawEdit;



