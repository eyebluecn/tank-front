import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Frame from './pages/Frame';
import en_US from 'antd/es/locale/en_US';

// global less 须放在Frame组件之后，不然会出现按需加载的less文件覆盖样式问题
import './App.less';

function App() {
  return (
    <Router>
      <ConfigProvider locale={en_US}>
        <Frame />
      </ConfigProvider>
    </Router>
  );
}

export default App;
