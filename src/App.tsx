import React from 'react';
import './App.less';
import {BrowserRouter as Router} from "react-router-dom";
import {ConfigProvider} from 'antd';
import Frame from "./pages/Frame";
import en_US from 'antd/es/locale/en_US';

function App() {
  return (
    <Router>
      <ConfigProvider locale={en_US}>
        <Frame/>
      </ConfigProvider>
    </Router>
  );
}

export default App;
