import React from 'react';
import './App.less';
import {Button} from "antd";
import {BrowserRouter as Router} from "react-router-dom";
import {ConfigProvider} from 'antd';
import Frame from "./pages/Frame";
import zhCN from 'antd/lib/locale-provider/zh_CN';


function App() {
  return (
    <Router>
      <ConfigProvider locale={zhCN}>
        <Frame/>
      </ConfigProvider>

    </Router>
  );
}

export default App;
