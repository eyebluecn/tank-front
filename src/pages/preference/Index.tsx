import React from 'react';
import {Link, RouteComponentProps} from "react-router-dom";
import "./Index.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import {Button} from "antd";
import {EditOutlined} from '@ant-design/icons';
import InfoCell from "../widget/InfoCell";
import Preference from "../../common/model/preference/Preference";
import TankContentCard from '../widget/TankContentCard';
import FileUtil from "../../common/util/FileUtil";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";


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

    this.refresh()

  }

  //refresh preference.
  refresh() {
    let that = this

    that.preference.httpFetch(function () {
      that.updateUI()

    })
  }

  render() {

    let that = this

    return (
      <div className="page-preference-index">
        <TankTitle name={Moon.t("layout.setting")}>
          <Link to={'/preference/edit'}>
            <Button type={"primary"} icon={<EditOutlined/>}>{Moon.t("edit")}</Button>
          </Link>
        </TankTitle>

        <TankContentCard>
          <InfoCell name={Moon.t("preference.websiteName")}>
            {this.preference.name}
          </InfoCell>

          <InfoCell name={Moon.t("preference.logo")}>
            {this.preference.logoUrl && (
              <img src={this.preference.logoUrl} alt="logo"
                   className="img-logo" onClick={() => {
                ImagePreviewer.showSinglePhoto(this.preference.logoUrl!)
              }}/>
            )}
          </InfoCell>

          <InfoCell name={'favicon'}>
            {this.preference.faviconUrl && (
              <img src={this.preference.faviconUrl} alt="logo"
                   className="img-favicon" onClick={() => {
                ImagePreviewer.showSinglePhoto(this.preference.faviconUrl!)
              }}/>
            )}
          </InfoCell>

          <InfoCell name={Moon.t("preference.copyright")}>
            <span dangerouslySetInnerHTML={{__html: this.preference.copyright}}/>

          </InfoCell>

          <InfoCell name={Moon.t("preference.extraInfo")}>
            <span dangerouslySetInnerHTML={{__html: this.preference.record}}/>
          </InfoCell>

          <InfoCell name={Moon.t("preference.zipMaxNumLimit")}>
            {this.preference.downloadDirMaxNum === -1 ? Moon.t("preference.noLimit") : this.preference.downloadDirMaxNum}
          </InfoCell>

          <InfoCell name={Moon.t("preference.zipMaxSizeLimit")}>
            {FileUtil.humanFileSize(this.preference.downloadDirMaxSize)}
          </InfoCell>

          <InfoCell name={Moon.t("preference.userDefaultSizeLimit")}>
            {FileUtil.humanFileSize(this.preference.defaultTotalSizeLimit)}
          </InfoCell>

          <InfoCell name={Moon.t("preference.allowRegister")}>
            {this.preference.allowRegister ? Moon.t("yes") : Moon.t("no")}
          </InfoCell>

          <InfoCell name={Moon.t("preference.docLink")}>
            <a href={'https://tank-doc.eyeblue.cn/zh'} target="_blank">
              https://tank-doc.eyeblue.cn/zh
            </a>
          </InfoCell>


        </TankContentCard>

      </div>
    );
  }
}


